// src/services/api.js

const API_BASE_URL = "https://brand-decor-ecom-api.vercel.app";

// Generic fetch with timeout to avoid hanging requests
const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (err) {
    // Normalize AbortError to a clearer message
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Subscribe to Newsletter
export const subscribeNewsletter = async (email) => {
  try {
    if (!email) throw new Error('Email is required');
    const url = `${API_BASE_URL}/newsletters/subscribe`; // backend 404s on trailing slash
    let lastErr = 'Failed to subscribe';

    // Attempt 1: JSON
    const resJson = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email })
    }, 15000);
    let contentType = resJson.headers.get('content-type') || '';
    let isJson = contentType.includes('application/json');
    let data = null;
    try { data = isJson ? await resJson.json() : null; } catch (_) {}
    if (resJson.ok) {
      return data || { message: 'Subscribed successfully!' };
    }
    // Capture error for JSON attempt
    if (!isJson) {
      try { lastErr = await resJson.text(); } catch (_) { lastErr = `${resJson.status} ${resJson.statusText}`; }
    } else {
      lastErr = data?.message || data?.detail || `${resJson.status} ${resJson.statusText}`;
    }
    const lower1 = String(lastErr).toLowerCase();
    if (lower1.includes('already')) {
      return { message: 'You are already subscribed!' };
    }

    // Attempt 2 (compat): form-urlencoded if JSON was rejected
    if (resJson.status === 400 || resJson.status === 415) {
      const resForm = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': 'application/json' },
        body: new URLSearchParams({ email })
      }, 15000);
      contentType = resForm.headers.get('content-type') || '';
      isJson = contentType.includes('application/json');
      data = null;
      try { data = isJson ? await resForm.json() : null; } catch (_) {}
      if (resForm.ok) {
        return data || { message: 'Subscribed successfully!' };
      }
      if (!isJson) {
        try { lastErr = await resForm.text(); } catch (_) { lastErr = `${resForm.status} ${resForm.statusText}`; }
      } else {
        lastErr = data?.message || data?.detail || `${resForm.status} ${resForm.statusText}`;
      }
      const lower2 = String(lastErr).toLowerCase();
      if (lower2.includes('already')) {
        return { message: 'You are already subscribed!' };
      }
    }

    throw new Error(lastErr);
  } catch (error) {
    throw error;
  }
};

// Admin Contacts APIs
// Accepts either a raw token (preferred) or a prebuilt Authorization header string
const resolveAdminAuthHeader = (input) => {
  if (!input) return null;
  const str = String(input);
  if (str.startsWith('Bearer ') || str.startsWith('Token ')) {
    return str; // already formatted header
  }
  return getAuthHeader(str, 'admin');
};

export const getAllContacts = async (tokenOrHeader) => {
  try {
    if (!tokenOrHeader) throw new Error('No authentication token provided');
    const t = String(tokenOrHeader);
    const candidates = t.startsWith('Bearer ') || t.startsWith('Token ')
      ? [t]
      : [`Token ${t}`, `Bearer ${t}`];

    let lastRes = null;
    let lastData = null;
    for (const auth of candidates) {
      const response = await fetch(`${API_BASE_URL}/newsletters/all-contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
      });
      lastRes = response;
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      lastData = null;
      try { lastData = isJson ? await response.json() : null; } catch (_) {}

      if (response.ok) {
        const data = lastData;
        return Array.isArray(data) ? data : (data?.contacts || []);
      }

      if (response.status === 401 || response.status === 403) {
        // try next auth scheme
        continue;
      }
      break; // non-auth error, stop retrying
    }

    const msg = lastData?.message || lastData?.detail || `${lastRes?.status || ''} ${lastRes?.statusText || ''}`.trim() || 'Failed to fetch contacts';
    throw new Error(msg);
  } catch (error) {
    throw error;
  }
};

export const getContactDetails = async (contactId, tokenOrHeader) => {
  try {
    if (!contactId) throw new Error('Contact ID is required');
    if (!tokenOrHeader) throw new Error('No authentication token provided');
    const t = String(tokenOrHeader);
    const candidates = t.startsWith('Bearer ') || t.startsWith('Token ')
      ? [t]
      : [`Token ${t}`, `Bearer ${t}`];

    let lastRes = null;
    let lastData = null;
    for (const auth of candidates) {
      const response = await fetch(`${API_BASE_URL}/newsletters/contact-details/${contactId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
      });
      lastRes = response;
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      lastData = null;
      try { lastData = isJson ? await response.json() : null; } catch (_) {}

      if (response.ok) {
        const data = lastData;
        return data?.contact || data;
      }
      if (response.status === 401 || response.status === 403) {
        continue; // try next scheme
      }
      break;
    }

    const msg = lastData?.message || lastData?.detail || `${lastRes?.status || ''} ${lastRes?.statusText || ''}`.trim() || 'Failed to fetch contact details';
    throw new Error(msg);
  } catch (error) {
    throw error;
  }
};

// Token validation helper
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Check if token is a JWT format (has 3 parts separated by dots)
    if (token.includes('.') && token.split('.').length === 3) {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } else {
      // For non-JWT tokens, just check if it's not empty and has reasonable length
      return token.length > 10;
    }
  } catch (error) {
    console.error('Token validation error:', error);
    // If JWT parsing fails, assume it's a simple token and check length
    return token.length > 10;
  }
};

// Get Auth Header Helper
export const getAuthHeader = (token, userType = 'user') => {
  if (!token) return '';
  
  // Use Token format for admin requests, Bearer for user requests
  if (userType === 'admin') {
    return `Token ${token}`;
  } else {
    return `Bearer ${token}`;
  }
};

// Rate an item (user-authenticated)
export const rateItem = async (itemId, rating, token) => {
  if (!itemId) throw new Error('Missing itemId');
  if (!token) throw new Error('Authentication required');
  if (typeof rating !== 'number' || rating <= 0) throw new Error('Invalid rating');

  const url = `${API_BASE_URL}/store/rate-item/${itemId}/`;
  const authHeaders = [`Bearer ${token}`, `Token ${token}`];
  let lastRes = null;
  let lastData = null;

  for (const auth of authHeaders) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
          },
          body: JSON.stringify({ rating }),
        },
        15000
      );

      lastRes = res;
      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      lastData = null;
      try {
        lastData = isJson ? await res.json() : null;
      } catch (_) {}

      if (res.ok) {
        return lastData || { message: 'Rating submitted successfully.' };
      }

      // If auth failed with this scheme, try the next
      if (res.status === 401 || res.status === 403) {
        // But if message indicates already-rated, surface that immediately
        const msg = (lastData?.message || lastData?.detail || '').toLowerCase();
        if (msg.includes('already')) {
          throw new Error('ALREADY_RATED');
        }
        continue;
      }

      // Non-auth errors: stop retrying and handle below
      break;
    } catch (e) {
      // Network-level error, proceed to next scheme
      continue;
    }
  }

  // Map error from lastRes/lastData
  const serverMsg = lastData?.message || lastData?.detail || lastRes?.statusText || 'Failed to submit rating';
  const msgLower = String(serverMsg).toLowerCase();
  if ((lastRes?.status === 409) || msgLower.includes('already rated') || msgLower.includes('already')) {
    throw new Error('ALREADY_RATED');
  }
  if (lastRes?.status === 401 || lastRes?.status === 403) {
    throw new Error('Authentication required');
  }
  throw new Error(serverMsg);
};

// Sign Up API
export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone_no: userData.phone,
        password: userData.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to sign up");
    }
    return data;
    
  } catch (error) {
    throw error;
  }
};

// Login API
export const login = async (userData) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Verify Email API
export const verifyEmail = async ({ email, otp }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify email");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Resend Verification OTP API
export const resendVerificationOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resend-verification-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to resend verification code");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Forgot Password API
export const forgotPassword = async (email) => {
  try {
    console.log("🔐 Making request to /forgot-password with email:", email);

    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    console.log("📡 Forgot Password API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to send password reset code";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 404) {
        errorMessage = "Email not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully sent password reset code:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in forgotPassword:", error);
    throw error;
  }
};

// Reset Password API
export const resetPassword = async ({ email, token, new_password }) => {
  try {
    console.log("🔐 Making request to /reset-password with email:", email);

    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token, new_password }),
    });

    console.log("📡 Reset Password API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to reset password";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 400) {
        errorMessage = "Invalid reset token or email.";
      } else if (response.status === 404) {
        errorMessage = "Reset token not found or expired.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully reset password:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    throw error;
  }
};

// Admin Sign Up API
export const adminSignUp = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin-signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone_no: userData.phone,
        password: userData.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to sign up as admin");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// Change Password API
export const changePassword = async ({ currentPassword, newPassword, token }) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!currentPassword || !newPassword) {
      throw new Error("Current and new passwords are required");
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const requestBody = JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    });

    const candidateEndpoints = [
      `${API_BASE_URL}/change-password`,
      `${API_BASE_URL}/user/change-password`,
      `${API_BASE_URL}/auth/change-password`,
      `${API_BASE_URL}/account/change-password`,
      `${API_BASE_URL}/profile/change-password`,
    ];

    let lastErrorMessage = "Failed to change password";

    for (const url of candidateEndpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: requestBody,
        });

        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");

        if (!response.ok) {
          let errorMessage = lastErrorMessage;
          try {
            if (isJson) {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } else {
              const text = await response.text();
              errorMessage = `Server returned ${response.status}: ${response.statusText}`;
              if (response.status === 404) {
                errorMessage = "Password endpoint not found (404). Please update the app or contact support.";
              }
            }
          } catch (_) {
            errorMessage = `Server returned ${response.status}: ${response.statusText}`;
          }

          lastErrorMessage = errorMessage;
          continue; // try next candidate endpoint
        }

        // Success
        const data = isJson ? await response.json() : { success: true };
        return data;
      } catch (singleAttemptError) {
        lastErrorMessage = singleAttemptError.message || lastErrorMessage;
        // try next endpoint
      }
    }

    throw new Error(lastErrorMessage);
  } catch (error) {
    throw error;
  }
};

// Get All Users API (Admin only)
export const getAllUsers = async (token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /all-users with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/all-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader, // Admin requests use "Token" not "Bearer"
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch users";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched users:", data);
    console.log("📊 Users array:", data.users);
    console.log("📊 Data structure:", Object.keys(data));
    
    // Return the users array directly
    if (data.users && Array.isArray(data.users)) {
      console.log("🎯 Returning users array with", data.users.length, "users");
      return data.users;
    } else if (Array.isArray(data)) {
      console.log("🎯 Data is already an array with", data.length, "items");
      return data;
    } else {
      console.warn("⚠️ Unexpected data structure, returning empty array");
      return [];
    }
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error);
    throw error;
  }
};

// Get User Details API (Admin only)
export const getUserDetails = async (userId, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /user-details with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/user-details/${userId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch user details";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 404) {
        errorMessage = "User not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched user details:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in getUserDetails:", error);
    throw error;
  }
};

// Add Item API (Admin only)
export const addItem = async (itemData, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!itemData.name || !itemData.description || !itemData.price || !itemData.category) {
      throw new Error("Missing required fields: name, description, price, and category are required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /store/add-item with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/store/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify({
        name: itemData.name,
        description: itemData.description,
        price: parseFloat(itemData.price),
        category: itemData.category,
        sub_category: itemData.sub_category || "",
        photo: itemData.photo || ""
      }),
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to add item";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 400) {
        errorMessage = "Invalid data provided. Please check your input.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully added item:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in addItem:", error);
    throw error;
  }
};

// Edit Item API (Admin only)
export const editItem = async (itemId, itemData, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!itemData.name || !itemData.description || !itemData.price || !itemData.category) {
      throw new Error("Missing required fields: name, description, price, and category are required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /store/edit-item with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const requestBody = {
      name: itemData.name,
      description: itemData.description,
      price: parseFloat(itemData.price),
      category: itemData.category,
      photo: itemData.photo || ""
    };
    
    console.log("📤 Edit request body:", requestBody);
    console.log("📤 Edit request URL:", `${API_BASE_URL}/store/edit-item/${itemId}/`);

    const response = await fetch(`${API_BASE_URL}/store/edit-item/${itemId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to update item";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 400) {
        errorMessage = "Invalid data provided. Please check your input.";
      } else if (response.status === 404) {
        errorMessage = "Item not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully updated item:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in editItem:", error);
    throw error;
  }
};

// Get All Items API
export const getAllItems = async () => {
  try {
    console.log("🔐 Making request to /store/all-items");

    const response = await fetch(`${API_BASE_URL}/store/all-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch items";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 404) {
        errorMessage = "Items endpoint not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched items:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in getAllItems:", error);
    throw error;
  }
};

// Get Single Item Details API
export const getItemDetails = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    console.log("🔐 Making request to /store/item-detail with item ID:", itemId);

    const response = await fetch(`${API_BASE_URL}/store/item-detail/${itemId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch item details";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 404) {
        errorMessage = "Item not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched item details:", data);
    // Normalize common API shapes: sometimes item is wrapped
    const normalized = data?.item ? data.item : data;
    return normalized;
  } catch (error) {
    console.error("❌ Error in getItemDetails:", error);
    throw error;
  }
};


// Create Order API
export const createOrder = async (orderData, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    if (!orderData.shipping_info) {
      throw new Error("Shipping information is required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    console.log("🔐 Making request to /store/create-order with user token:", token.substring(0, 20) + "...");

    const url = `${API_BASE_URL}/store/create-order`;
    const authHeaders = [
      getAuthHeader(token, 'user'), // Bearer
      `Token ${token}` // Fallback for APIs expecting Token
    ];

    let lastRes = null;
    let lastData = null;
    for (const auth of authHeaders) {
      console.log("🔐 Using authorization header:", auth);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth,
        },
        body: JSON.stringify(orderData),
      });

      console.log("📡 API Response Status:", response.status, response.statusText);
      lastRes = response;
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      lastData = null;
      try { lastData = isJson ? await response.json() : null; } catch (_) {}

      if (response.ok) {
        console.log("✅ Successfully created order:", lastData);
        return lastData;
      }

      if (response.status === 401 || response.status === 403) {
        // Try next scheme
        continue;
      } else {
        // Non-auth failure – stop retrying
        break;
      }
    }

    // Map error from lastRes/lastData
    let errorMessage = lastData?.message || lastData?.detail || lastData?.error || `Failed to create order`;
    if (lastRes?.status === 401) {
      errorMessage = "Authentication failed. Please log in again.";
    } else if (lastRes?.status === 403) {
      errorMessage = "Access denied. Please log in to create orders.";
    } else if (lastRes?.status === 400) {
      errorMessage = "Invalid order data. Please check your information.";
    } else if (lastRes?.status === 500) {
      errorMessage = "Server error. Please try again later.";
    }
    throw new Error(errorMessage);
  } catch (error) {
    console.error("❌ Error in createOrder:", error);
    throw error;
  }
};

// Get All Orders API (Admin only)
export const getAllOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /all-orders with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/store/all-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch orders";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }

      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched orders:", data);
    return data.orders || data.data || data;
  } catch (error) {
    console.error("❌ Error in getAllOrders:", error);
    throw error;
  }
};

// Get Order Details API
export const getOrderDetails = async (orderId, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const url = `${API_BASE_URL}/store/order-detail/${orderId}/`;
    const auths = [getAuthHeader(token, 'user'), `Token ${token}`];
    let lastRes = null, lastData = null;
    for (const auth of auths) {
      console.log("🔐 Making request to /store/order-detail with:", auth.slice(0, 10) + "...");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth,
        },
      });
      console.log("📡 API Response Status:", response.status, response.statusText);
      lastRes = response;
      const ct = response.headers.get('content-type') || '';
      const isJson = ct.includes('application/json');
      lastData = null;
      try { lastData = isJson ? await response.json() : null; } catch(_){}
      if (response.ok) {
        return lastData;
      }
      if (response.status === 401 || response.status === 403) continue;
      break;
    }
    let errorMessage = lastData?.message || lastData?.detail || lastRes?.statusText || "Failed to fetch order details";
    if (lastRes?.status === 401) errorMessage = "Authentication failed. Please log in again.";
    else if (lastRes?.status === 403) errorMessage = "Access denied. You can only view your own orders or admin access required.";
    else if (lastRes?.status === 404) errorMessage = "Order not found.";
    else if (lastRes?.status === 500) errorMessage = "Server error. Please try again later.";
    throw new Error(errorMessage);
  } catch (error) {
    console.error("❌ Error in getOrderDetails:", error);
    throw error;
  }
};

// Get My Orders API (User's own orders)
export const getMyOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const url = `${API_BASE_URL}/store/my-orders`;
    const auths = [getAuthHeader(token, 'user'), `Token ${token}`];
    let lastRes = null, lastData = null;
    for (const auth of auths) {
      console.log("🔐 Making request to /store/my-orders with:", auth.slice(0, 10) + "...");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth,
        },
      });
      console.log("📡 API Response Status:", response.status, response.statusText);
      lastRes = response;
      const ct = response.headers.get('content-type') || '';
      const isJson = ct.includes('application/json');
      lastData = null;
      try { lastData = isJson ? await response.json() : null; } catch(_){}
      if (response.ok) {
        const data = lastData;
        return data?.orders || [];
      }
      if (response.status === 401 || response.status === 403) continue;
      break;
    }
    let errorMessage = lastData?.message || lastData?.detail || lastRes?.statusText || "Failed to fetch orders";
    if (lastRes?.status === 401) errorMessage = "Authentication failed. Please log in again.";
    else if (lastRes?.status === 403) errorMessage = "Access denied. Please log in to view your orders.";
    else if (lastRes?.status === 500) errorMessage = "Server error. Please try again later.";
    throw new Error(errorMessage);
  } catch (error) {
    console.error("❌ Error in getMyOrders:", error);
    throw error;
  }
};

// Update Order Status API (Admin only)
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!status) {
      throw new Error("Status is required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /store/update-order-status with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/store/update-order-status/${orderId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify({ status }),
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to update order status";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 404) {
        errorMessage = "Order not found.";
      } else if (response.status === 400) {
        errorMessage = "Invalid status. Please check the status value.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully updated order status:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in updateOrderStatus:", error);
    throw error;
  }
};

// Pay for Order API
export const payForOrder = async (orderId, phone, amount, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!phone) {
      throw new Error("Phone number is required");
    }

    if (!amount || amount <= 0) {
      throw new Error("Valid amount is required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const url = `${API_BASE_URL}/payments/pay/${orderId}/`;
    const auths = [getAuthHeader(token, 'user'), `Token ${token}`];
    let lastRes = null, lastData = null, lastText = '';
    for (const auth of auths) {
      console.log("🔐 Making request to /payments/pay with:", auth.slice(0, 10) + "...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth,
        },
        body: JSON.stringify({ 
          phone: phone.toString(),
          amount: parseFloat(amount)
        }),
      });
      console.log("📡 API Response Status:", response.status, response.statusText);
      lastRes = response;
      const ct = response.headers.get('content-type') || '';
      const isJson = ct.includes('application/json');
      lastData = null; lastText = '';
      if (isJson) {
        try { lastData = await response.json(); } catch(_) {}
      } else {
        try { lastText = await response.text(); } catch(_) {}
      }

      if (response.ok) {
        const data = lastData || {};
        console.log("✅ Successfully initiated payment:", data);
        return data;
      }

      // If auth failed, try next scheme
      if (response.status === 401 || response.status === 403) {
        continue;
      }

      // Some gateways return 400 with non-JSON but the STK push is already sent.
      if (response.status === 400 && !isJson) {
        const hint = (lastText || '').toLowerCase();
        if (hint.includes('stk') || hint.includes('request') || hint.includes('success')) {
          console.log("⚠️ Treating non-JSON 400 as soft-success due to gateway hint:", lastText);
          return { success: true, message: 'Payment request sent.' };
        }
      }

      // Non-auth error; break and map below
      break;
    }

    // If the gateway responded with a JSON error like "Expecting value..." but STK was likely triggered, treat as soft success
    if (lastRes?.status === 400) {
      const errStr = (lastData?.message || lastData?.detail || lastData?.error || '').toString().toLowerCase();
      if (errStr.includes('expecting value')) {
        console.log('⚠️ Treating JSON 400 with "Expecting value" as soft-success.');
        return { success: true, message: 'Payment request sent.' };
      }
    }
    let errorMessage = lastData?.message || lastData?.detail || lastData?.error || `Failed to initiate payment`;
    if (lastRes?.status === 401) errorMessage = "Authentication failed. Please log in again.";
    else if (lastRes?.status === 403) errorMessage = "Access denied. Please log in to make payments.";
    else if (lastRes?.status === 404) errorMessage = "Order not found.";
    else if (lastRes?.status === 400) errorMessage = "Invalid payment data. Please check your information.";
    else if (lastRes?.status === 500) errorMessage = "Server error. Please try again later.";
    throw new Error(errorMessage);
  } catch (error) {
    console.error("❌ Error in payForOrder:", error);
    throw error;
  }
};

// Check Transaction Status API
export const checkTransactionStatus = async (checkoutRequestId) => {
  try {
    if (!checkoutRequestId) {
      throw new Error("Checkout request ID is required");
    }

    console.log("🔐 Making request to /payments/transaction-status with checkout ID:", checkoutRequestId);

    const response = await fetch(`${API_BASE_URL}/payments/transaction-status/${checkoutRequestId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to check transaction status";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully checked transaction status:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in checkTransactionStatus:", error);
    throw error;
  }
};

// Get All Transactions API (Admin only)
export const getAllTransactions = async (token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /payments/all-transactions with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/payments/all-transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch transactions";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched transactions:", data);
    return data.transactions || [];
  } catch (error) {
    console.error("❌ Error in getAllTransactions:", error);
    throw error;
  }
};

// Get Transaction Details API (Admin only)
export const getTransactionDetails = async (transactionId, token) => {
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    if (!transactionId) {
      throw new Error("Transaction ID is required");
    }

    // Validate token before making the request
    if (!isTokenValid(token)) {
      throw new Error("Authentication token has expired. Please log in again.");
    }

    const authHeader = getAuthHeader(token, 'admin');
    console.log("🔐 Making request to /payments/transaction-details with admin token:", token.substring(0, 20) + "...");
    console.log("🔐 Using authorization header:", authHeader);

    const response = await fetch(`${API_BASE_URL}/payments/transaction-details/${transactionId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    console.log("📡 API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to fetch transaction details";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        console.log("📄 Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 404) {
        errorMessage = "Transaction not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched transaction details:", data);
    return data.transaction;
  } catch (error) {
    console.error("❌ Error in getTransactionDetails:", error);
    throw error;
  }
};

// Contact Us API
export const submitContactForm = async (contactData) => {
  try {
    console.log("📧 Making request to /newsletters/contact-us with data:", contactData);

    const requestBody = {
      full_name: contactData.fullName || contactData.name,
      email: contactData.email,
      phone_number: contactData.phoneNumber || contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    };

    console.log("📤 Contact request body:", requestBody);

    const response = await fetch(`${API_BASE_URL}/newsletters/contact-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Contact API Response Status:", response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = "Failed to submit contact form";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log("📄 Contact Error response data:", errorData);
      } catch (parseError) {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`;
        console.log("❌ Failed to parse contact error response:", parseError);
      }
      
      // Handle specific status codes
      if (response.status === 400) {
        errorMessage = "Invalid contact data. Please check your information.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully submitted contact form:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in submitContactForm:", error);
    throw error;
  }
};