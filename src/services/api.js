// src/services/api.js

const API_BASE_URL = "https://brand-decor-ecom-api.vercel.app";

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

// Utility function to get the correct authorization header based on user type
export const getAuthHeader = (token, userType = 'user') => {
  if (userType === 'admin') {
    return `Token ${token}`;
  }
  return `Bearer ${token}`;
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
    const response = await fetch(`${API_BASE_URL}/login`, {
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
      
      // Handle specific status codes
      if (response.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (response.status === 404) {
        errorMessage = "API endpoint not found.";
      }

      // Retry with alternate headers/endpoints if unauthorized/forbidden
      if (response.status === 401 || response.status === 403) {
        console.log("🔁 Retrying users fetch with alternative auth headers...");

        // Try with Token format and standard headers only
        const altHeaders = {
          "Content-Type": "application/json",
          "Authorization": getAuthHeader(token, 'admin'),
        };

        // Try alternate endpoints commonly used by backends
        const altEndpoints = [
          `${API_BASE_URL}/all-users`,
          `${API_BASE_URL}/users`,
          `${API_BASE_URL}/admin/all-users`,
          `${API_BASE_URL}/admin/users`,
        ];

        for (const url of altEndpoints) {
          try {
            const altResp = await fetch(url, { method: "GET", headers: altHeaders });
            console.log("🔁 Alt attempt:", url, altResp.status, altResp.statusText);
            if (altResp.ok) {
              const altData = await altResp.json();
              console.log("✅ Alt fetch succeeded");
              return altData;
            }
          } catch (altErr) {
            console.log("❌ Alt fetch error:", altErr);
          }
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched users:", data);
    return data;
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
    return data;
  } catch (error) {
    console.error("❌ Error in getItemDetails:", error);
    throw error;
  }
};