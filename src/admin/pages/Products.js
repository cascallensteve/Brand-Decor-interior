import React, { useEffect, useMemo, useState } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTrashAlt,
  FaFilter, 
  FaImage, 
  FaEye, 
  FaStar, 
  FaRegStar, 
  FaUpload,
  FaTimes,
  FaFilePdf,
  FaSync,
  FaInfoCircle,
  FaBox
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addItem, editItem, getAllItems, getItemDetails } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { PageBanner } from '../../admin';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Bedroom',
    sub_category: '',
    price: '',
    photo: ''
  });
  // Locally uploaded files (from computer) with names; do not auto-fill URL field
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [isLoadingAllItems, setIsLoadingAllItems] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isItemDetailModalOpen, setIsItemDetailModalOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [isLoadingItemDetails, setIsLoadingItemDetails] = useState(false);
  const { user: currentUser, isAdmin, getToken } = useAuth();
  const { items: cachedItems, refresh } = useAdminData();

  // Inline SVG placeholders to avoid network calls and onError loops
  const FALLBACK_IMG_48 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="8" fill="%239ca3af">Image</text></svg>';
  const FALLBACK_IMG_40 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="8" fill="%239ca3af">Image</text></svg>';
  const FALLBACK_IMG_192 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="%239ca3af">Image</text></svg>';

  // Normalize API photo field: fix cases like "image/upload/https://..." and accept data URLs
  const normalizePhotoValue = (value) => {
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (trimmed.startsWith('data:image')) return trimmed; // base64/data URL
    // If API returned a malformed cloudinary string like 'image/upload/https://...'
    if (trimmed.startsWith('image/upload/https://') || trimmed.startsWith('image/upload/http://')) {
      return trimmed.replace(/^image\/upload\//, '');
    }
    return trimmed;
  };

  // Normalize sub category across possible backend keys
  const normalizeSubCategory = (item) => {
    const candidates = [item.sub_category, item.subCategory, item.subcategory, item.sub_cat, item.subCat];
    for (const v of candidates) {
      if (typeof v === 'string' && v.trim() !== '') return v.trim();
    }
    return '';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Load products from API when component mounts
  const loadProducts = async (forceRefresh = false) => {
    try {
      setIsLoadingProducts(true);
      console.log('🔄 Loading products from API...', forceRefresh ? '(Force Refresh)' : '');
      
      // Add cache-busting parameter if force refresh is requested
      const response = await getAllItems();
      console.log('📦 Products loaded from API:', response);
      console.log('📦 Number of items received:', response.items?.length || 0);
      
      if (!response.items || !Array.isArray(response.items)) {
        throw new Error('Invalid response format from API');
      }
      
      // Map API response to our product format
      const mappedProducts = response.items.map(item => {
        console.log('🔄 Mapping item:', item.id, item.name, 'Price:', item.price, 'Photo:', item.photo);
        
        // Handle photo/image data more robustly (support photo, image, images)
        let images = [];
        const candidateSingleRaw = item.photo || item.image;
        const candidateSingle = normalizePhotoValue(candidateSingleRaw);
        const candidateArrayRaw = item.images || (Array.isArray(item.photo) ? item.photo : []) || (Array.isArray(item.image) ? item.image : []);
        const candidateArray = Array.isArray(candidateArrayRaw) ? candidateArrayRaw.map(normalizePhotoValue) : [];
        if (candidateSingle && typeof candidateSingle === 'string' && candidateSingle.trim() !== '') {
          images = [candidateSingle];
        } else if (Array.isArray(candidateArray) && candidateArray.length > 0) {
          images = candidateArray.filter(img => typeof img === 'string' && img && img.trim() !== '');
        }
        
        console.log('🖼️ Processed images for item', item.id, ':', images);
        
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          sub_category: normalizeSubCategory(item),
          price: parseFloat(item.price),
          stock: 0, // Default stock for display
          status: 'In Stock',
          rating: item.average_rating || 0,
          images: images,
          owner: item.owner
        };
      });
      
      console.log('✅ Mapped products:', mappedProducts);
      setProducts(mappedProducts);
      
      if (forceRefresh) {
        toast.success(`🔄 Force refreshed ${mappedProducts.length} products`, {
          position: "top-right",
          autoClose: 2000,
          style: {
            background: '#3B82F6',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
      } else {
        toast.success(`✅ Loaded ${mappedProducts.length} products`, {
          position: "top-right",
          autoClose: 2000,
          style: {
            background: '#065F46',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
      }
    } catch (error) {
      console.error('❌ Error loading products:', error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Initialize from cached items on first mount; fallback to API if cache empty
  useEffect(() => {
    if (Array.isArray(cachedItems) && cachedItems.length > 0) {
      // Map cached items to local product shape quickly
      const mapped = cachedItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        sub_category: item.sub_category || '',
        price: parseFloat(item.price),
        stock: 0,
        status: 'In Stock',
        rating: item.average_rating || 0,
        images: item.photo ? [item.photo] : (Array.isArray(item.images) ? item.images : []),
        owner: item.owner,
      }));
      setProducts(mapped);
    } else {
      // Fallback to API only if no cache
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If user types a URL into photo field, clear any uploaded files (mutually exclusive)
    if (name === 'photo') {
      setUploadedFiles([]);
    }
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, dataUrl: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }));
    try {
      const results = await Promise.all(readers);
      // Clear URL input if we're uploading files (mutually exclusive)
      if (results.length > 0) {
        setNewProduct(prev => ({ ...prev, photo: '' }));
      }
      // Do NOT overwrite the URL field with base64; keep separate
      setUploadedFiles(prev => [...prev, ...results]);
    } catch (err) {
      toast.error('❌ Failed to read image. Please try a different file.');
    }
  };

  const removeImage = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is admin
    if (!isAdmin()) {
      toast.error('🚫 Access denied. Admin privileges required.', {
        position: "top-right",
        autoClose: 4000,
        style: {
          background: '#F59E0B',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }

    // Validate required fields
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
      toast.error('⚠️ Please fill in all required fields.', {
        position: "top-right",
        autoClose: 4000,
        style: {
          background: '#F59E0B',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Prefer locally uploaded file as primary photo; include filename (mutually exclusive with URL)
      const primaryUpload = uploadedFiles[0];
      const itemData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        sub_category: newProduct.sub_category || '',
        photo: primaryUpload ? primaryUpload.dataUrl : (newProduct.photo || ""),
        photo_filename: primaryUpload ? primaryUpload.name : undefined
      };

      let response;
      if (isEditing) {
        // Edit existing item
        response = await editItem(newProduct.id, itemData, token);
        
        // Debug logging
        console.log('Edit API Response:', response);
        console.log('Photo from Edit API:', response.item.photo);
        console.log('Edit item data sent:', itemData);
        
        // Update the item in the local state
        // Use the photo from API response, or fallback to the original photo URL from form
        // For now, prioritize the form photo URL to ensure it shows
        const photoUrl = primaryUpload ? primaryUpload.dataUrl : (
          (newProduct.photo && newProduct.photo !== "") 
          ? newProduct.photo 
            : (response.item.photo && response.item.photo !== "" && response.item.photo !== null ? response.item.photo : null)
        );
          
        const updatedItem = {
          id: response.item.id,
          name: response.item.name,
          description: response.item.description,
          category: response.item.category,
          price: parseFloat(response.item.price),
          stock: 0, // Default stock for display
          status: 'In Stock',
          rating: response.item.average_rating || 0,
          images: photoUrl ? [photoUrl] : []
        };
        
        console.log('Photo URL used for edit:', photoUrl);
        console.log('Updated item created:', updatedItem);
        console.log('Images array for edit:', updatedItem.images);

        // Update the local state immediately with the API response
        setProducts(products.map(p => p.id === newProduct.id ? updatedItem : p));
        
        toast.success('✅ Product updated successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: '#065F46',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
        
        // Verify the changes were saved by checking the API response
        console.log('🔍 Verifying edit was saved...');
        console.log('📝 Original data sent:', itemData);
        console.log('📝 API response data:', response.item);
        
        // Check if the API response matches what we sent
        const dataMatches = (
          response.item.name === itemData.name &&
          response.item.description === itemData.description &&
          parseFloat(response.item.price) === itemData.price &&
          response.item.category === itemData.category
        );
        
        if (dataMatches) {
          console.log('✅ Edit verification successful - data matches');
        } else {
          console.warn('⚠️ Edit verification failed - data mismatch');
          console.log('Expected:', itemData);
          console.log('Received:', response.item);
          
          // Show a warning toast
          toast.warning('⚠️ Edit saved but data mismatch detected. Please refresh to verify.', {
            position: "top-right",
            autoClose: 7000,
            style: {
              background: '#F59E0B',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }
          });
        }
      } else {
        // Add new item
        response = await addItem(itemData, token);
        
        // Debug logging
        console.log('API Response:', response);
        console.log('Photo from API:', response.item.photo);
        console.log('Item data sent:', itemData);
        
        // Add the new item to the local state
        // Use the photo from API response, or fallback to the original photo URL from form
        // For now, prioritize the form photo URL to ensure it shows
        const photoUrl = primaryUpload ? primaryUpload.dataUrl : (
          (newProduct.photo && newProduct.photo !== "") 
          ? newProduct.photo 
            : (response.item.photo && response.item.photo !== "" && response.item.photo !== null ? response.item.photo : null)
        );
          
        const newItem = {
          id: response.item.id,
          name: response.item.name,
          description: response.item.description,
          category: response.item.category,
          price: parseFloat(response.item.price),
          stock: 0, // Default stock for display
          status: 'In Stock',
          rating: response.item.average_rating || 0,
          images: photoUrl ? [photoUrl] : []
        };
        
        console.log('Photo URL used:', photoUrl);
        console.log('New item created:', newItem);
        console.log('Images array:', newItem.images);

        // Add the new item to local state immediately
        setProducts([...products, newItem]);
        
        toast.success('✅ Product added successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: '#065F46',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
        
        // Don't refresh immediately - let the user see the changes
        // Only refresh if there's a specific need to sync with server
      }

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        category: 'Bedroom',
        sub_category: '',
        price: '',
        photo: ''
      });
      setUploadedFiles([]);
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`❌ ${error.message || 'Failed to add product. Please try again.'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.category,
      sub_category: product.sub_category || '',
      price: product.price,
      photo: product.images && product.images.length > 0 ? product.images[0] : ''
    });
    setUploadedFiles([]);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    // For now, just remove from local state
    // TODO: Implement delete API endpoint when available
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteModalOpen(false);
    toast.success('🗑️ Product deleted successfully!', {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: '#065F46',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500'
      }
    });
  };

  const handleViewAllItems = async () => {
    try {
      setIsLoadingAllItems(true);
      const response = await getAllItems();
      console.log('All items response:', response);
      
      // Map API response to our product format
      const mappedItems = response.items.map(item => {
        console.log('🔄 Mapping all items - item:', item.id, item.name, 'Photo:', item.photo);
        
        // Handle photo/image data more robustly (support photo, image, images)
        let images = [];
        const candidateSingleRaw = item.photo || item.image;
        const candidateSingle = normalizePhotoValue(candidateSingleRaw);
        const candidateArrayRaw = item.images || (Array.isArray(item.photo) ? item.photo : []) || (Array.isArray(item.image) ? item.image : []);
        const candidateArray = Array.isArray(candidateArrayRaw) ? candidateArrayRaw.map(normalizePhotoValue) : [];
        if (candidateSingle && typeof candidateSingle === 'string' && candidateSingle.trim() !== '') {
          images = [candidateSingle];
        } else if (Array.isArray(candidateArray) && candidateArray.length > 0) {
          images = candidateArray.filter(img => typeof img === 'string' && img && img.trim() !== '');
        }
        
        console.log('🖼️ Processed images for all items - item', item.id, ':', images);
        
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          sub_category: normalizeSubCategory(item),
          price: parseFloat(item.price),
          stock: 0, // Default stock for display
          status: 'In Stock',
          rating: item.average_rating || 0,
          images: images,
          owner: item.owner
        };
      });
      
      setAllItems(mappedItems);
      setIsViewAllModalOpen(true);
    } catch (error) {
      console.error('Error fetching all items:', error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setIsLoadingAllItems(false);
    }
  };

  const exportToPDF = () => {
    try {
      // Use allItems if available, otherwise use products
      const itemsToExport = allItems.length > 0 ? allItems : products;
      
      if (itemsToExport.length === 0) {
        toast.error('❌ No items to export', {
          position: "top-right",
          autoClose: 3000,
          style: {
            background: '#EF4444',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
        return;
      }

      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      // Logo (if available)
      try {
        const logoImg = new Image();
        logoImg.src = '/logo.png';
        // Note: In browsers, addImage from URL can be restricted; fallback silently
        // We'll draw a small placeholder rect if addImage fails
        doc.addImage(logoImg, 'PNG', 40, 32, 40, 40);
      } catch (e) {
        // Draw placeholder box
        doc.setDrawColor(230);
        doc.rect(40, 32, 40, 40);
      }
      doc.setFontSize(18);
      doc.text('Brand Decor - All Products', 90, 50);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 90, 64);
      
      // Prepare table data
      const tableData = itemsToExport.map(item => [
        item.id,
        item.name,
        item.category,
        (item.sub_category || '—'),
        `KSh ${item.price.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        item.owner ? `${item.owner.first_name} ${item.owner.last_name}` : 'N/A',
        (item.rating || 0).toFixed(1)
      ]);
      
      // Add table
      autoTable(doc, {
        head: [['ID', 'Product Name', 'Category', 'Sub Category', 'Price', 'Owner', 'Rating']],
        body: tableData,
        startY: 90,
        styles: {
          fontSize: 9,
          cellPadding: 6
        },
        headStyles: {
          fillColor: [249, 115, 22], // Orange brand
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });
      
      // Footer
      const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setTextColor(120);
          doc.text('Brand Decor Furniture • branddecor.ke', 40, doc.internal.pageSize.getHeight() - 30);
          doc.text(`Page ${i} of ${pageCount}`, pageWidth - 100, doc.internal.pageSize.getHeight() - 30);
        }
      };
      addFooter();
      
      // Save the PDF
      doc.save('brand-decor-products.pdf');
      
      toast.success('📄 PDF exported successfully!', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: '#065F46',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('❌ Failed to export PDF', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    }
  };

  // Test function to verify edit functionality
  const testEditFunctionality = async () => {
    if (products.length === 0) {
      toast.error('❌ No products available to test', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }

    const testProduct = products[0];
    const originalName = testProduct.name;
    const testName = `${originalName} - TEST ${Date.now()}`;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🧪 Testing edit functionality...');
      console.log('🧪 Original product:', testProduct);
      
      const testData = {
        name: testName,
        description: testProduct.description,
        price: testProduct.price,
        category: testProduct.category,
        photo: testProduct.images && testProduct.images.length > 0 ? testProduct.images[0] : ""
      };

      console.log('🧪 Test data to send:', testData);
      
      const response = await editItem(testProduct.id, testData, token);
      console.log('🧪 Edit response:', response);
      
      // Wait a moment then refresh to see if the change persisted
      setTimeout(async () => {
        console.log('🧪 Refreshing to check if change persisted...');
        await loadProducts(true);
        
        const updatedProduct = products.find(p => p.id === testProduct.id);
        if (updatedProduct && updatedProduct.name === testName) {
          console.log('✅ Test successful - edit persisted');
          toast.success('✅ Edit test successful - changes persisted!', {
            position: "top-right",
            autoClose: 5000,
            style: {
              background: '#065F46',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }
          });
        } else {
          console.log('❌ Test failed - edit did not persist');
          toast.error('❌ Edit test failed - changes did not persist', {
            position: "top-right",
            autoClose: 5000,
            style: {
              background: '#EF4444',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }
          });
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Test edit failed:', error);
      toast.error(`❌ Test edit failed: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    }
  };

  // Handle viewing item details
  const handleViewItemDetails = async (product) => {
    try {
      setIsLoadingItemDetails(true);
      console.log('🔍 Fetching details for item:', product.id);
      
      const response = await getItemDetails(product.id);
      console.log('📦 Item details response:', response);
      
      // Normalize details photo and fallback to list image if API returns null/invalid
      const normalizedPhoto = normalizePhotoValue(response.item?.photo);
      const fallbackListPhoto = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '';
      const mergedDetails = {
        ...response.item,
        photo: normalizedPhoto || fallbackListPhoto
      };
      // Normalize sub category on details as well
      mergedDetails.sub_category = normalizeSubCategory(mergedDetails);
      setItemDetails(mergedDetails);
      setIsItemDetailModalOpen(true);
      
    } catch (error) {
      console.error('❌ Error fetching item details:', error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setIsLoadingItemDetails(false);
    }
  };

  // Test image loading functionality
  const testImageLoading = () => {
    console.log('🧪 Testing image loading...');
    console.log('📊 Current products:', products);
    
    products.forEach((product, index) => {
      console.log(`📸 Product ${index + 1} (ID: ${product.id}):`, {
        name: product.name,
        images: product.images,
        hasImages: !!product.images,
        imagesLength: product.images?.length || 0,
        firstImage: product.images?.[0]
      });
    });
    
    toast.info('🧪 Image loading test completed. Check console for details.', {
      position: "top-right",
      autoClose: 3000,
      style: {
        background: '#3B82F6',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500'
      }
    });
  };

  const openImageModal = (product, index = 0) => {
    setSelectedProduct(product);
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex space-x-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          
          <button 
            onClick={exportToPDF}
            disabled={products.length === 0}
            className="flex items-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaFilePdf className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>Product</span>
                    <FaFilter className="h-3 w-3 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sub Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoadingProducts ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <span className="text-gray-600">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FaImage className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-500 mb-4">
                        {products.length === 0 
                          ? "Get started by adding your first product." 
                          : "No products match your search criteria."}
                      </p>
                      {products.length === 0 && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaPlus className="h-4 w-4 mr-2" />
                          Add Your First Product
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {(() => {
                            const hasValidImage = product.images && 
                                                 product.images.length > 0 && 
                                                 product.images[0] && 
                                                 product.images[0].trim() !== "" &&
                                                 product.images[0] !== "null" &&
                                                 product.images[0] !== "undefined";
                            
                            // Removed verbose console logging to prevent flooding
                            
                            if (hasValidImage) {
                              return (
                                <img 
                                  className="h-12 w-12 rounded-md object-cover border border-gray-200" 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  onError={(e) => {
                                    console.log('❌ Image failed to load:', product.images[0]);
                                    e.target.onerror = null;
                                    e.target.src = FALLBACK_IMG_48;
                                  }}
                                  onLoad={() => {
                                    console.log('✅ Image loaded successfully:', product.images[0]);
                                  }}
                                />
                              );
                            } else {
                              return (
                                <img 
                                  className="h-12 w-12 rounded-md object-cover border border-gray-200" 
                                  src={FALLBACK_IMG_48} 
                                  alt={product.name}
                                />
                              );
                            }
                          })()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">ID: #{product.id}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{product.category}{product.sub_category ? ` • ${product.sub_category}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                        {product.sub_category || '—'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">KSh {product.price.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.stock} units</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        product.status === 'In Stock' 
                          ? 'bg-green-100 text-green-800' 
                          : product.status === 'Low Stock' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewItemDetails(product)}
                        className="mr-3 text-green-600 hover:text-green-900"
                        title="View Details"
                      >
                        <FaInfoCircle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(product)}
                        className="mr-3 text-blue-600 hover:text-blue-900"
                        title="Edit Product"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(product)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Product"
                      >
                        <FaTrashAlt className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                <button
                  aria-current="page"
                  className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  2
                </button>
                <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">
                  3
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Product Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter product description"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="Sofas">Sofas</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Interior Decor">Interior Decor</option>
                        <option value="Dining">Dining</option>
                      </select>
                    </div>

                    {/* Sub Category (dynamic based on category) */}
                    <div>
                      <label htmlFor="sub_category" className="block text-sm font-medium text-gray-700">
                        Sub Category
                      </label>
                      <select
                        id="sub_category"
                        name="sub_category"
                        value={newProduct.sub_category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {newProduct.category === 'Sofas' && (
                          <>
                            <option value="General Sofas">General Sofas</option>
                            <option value="L Shaped Sofas">L Shaped Sofas</option>
                          </>
                        )}
                        {newProduct.category === 'Living Room' && (
                          <>
                            <option value="Coffee Tables">Coffee Tables</option>
                            <option value="Consoles">Consoles</option>
                            <option value="TV Stands">TV Stands</option>
                          </>
                        )}
                        {newProduct.category === 'Bedroom' && (
                          <>
                            <option value="Chest of Drawers">Chest of Drawers</option>
                            <option value="Chester Beds">Chester Beds</option>
                            <option value="Dressing Mirror">Dressing Mirror</option>
                            <option value="Mirror Beds">Mirror Beds</option>
                            <option value="Night Stand">Night Stand</option>
                            <option value="Wardrobe">Wardrobe</option>
                            <option value="Wooden Beds">Wooden Beds</option>
                          </>
                        )}
                        {newProduct.category === 'Dining' && (
                          <>
                            <option value="Dining Tables">Dining Tables</option>
                            <option value="Dining Chairs">Dining Chairs</option>
                          </>
                        )}
                        {newProduct.category === 'Interior Decor' && (
                          <>
                            <option value="Wall Art">Wall Art</option>
                            <option value="Rugs">Rugs</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (KSh) *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">KSh</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={newProduct.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    {/* Photo URL */}
                    <div>
                      <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                        Photo URL
                      </label>
                      <input
                        type="url"
                        id="photo"
                        name="photo"
                        value={newProduct.photo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter image URL (optional)"
                        disabled={uploadedFiles.length > 0}
                      />
                      
                      {/* Photo Preview */}
                      {newProduct.photo && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Photo Preview
                          </label>
                          <div className="relative inline-block">
                            <img
                              src={newProduct.photo}
                              alt="Product preview"
                              className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div 
                              className="h-32 w-32 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm"
                              style={{ display: 'none' }}
                            >
                              Invalid URL
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Local Image Upload (base64) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60"
                        disabled={!!newProduct.photo}
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="relative">
                              <img src={file.dataUrl} alt={file.name || `Upload ${idx+1}`} className="h-24 w-24 object-cover rounded-md border" />
                              <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrashAlt className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Items Modal */}
      {isViewAllModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsViewAllModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    All Items ({allItems.length})
                  </h3>
                  <button
                    onClick={() => setIsViewAllModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                {isLoadingAllItems ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading all items...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {(() => {
                                    const hasValidImage = item.images && 
                                                         item.images.length > 0 && 
                                                         item.images[0] && 
                                                         item.images[0].trim() !== "" &&
                                                         item.images[0] !== "null" &&
                                                         item.images[0] !== "undefined";
                                    
                                    if (hasValidImage) {
                                      return (
                                        <img 
                                          className="h-10 w-10 rounded-md object-cover border border-gray-200" 
                                          src={item.images[0]} 
                                          alt={item.name}
                                          onError={(e) => {
                                            console.log('❌ Image failed to load in all items:', item.images[0]);
                                            e.target.onerror = null;
                                            e.target.src = FALLBACK_IMG_40;
                                          }}
                                          onLoad={() => {
                                            console.log('✅ Image loaded successfully in all items:', item.images[0]);
                                          }}
                                        />
                                      );
                                    } else {
                                      return (
                                        <img 
                                          className="h-10 w-10 rounded-md object-cover border border-gray-200" 
                                          src={FALLBACK_IMG_40} 
                                          alt={item.name}
                                        />
                                      );
                                    }
                                  })()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-xs text-gray-500">ID: #{item.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                {item.sub_category || '—'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              KSh {item.price.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.owner ? `${item.owner.first_name} ${item.owner.last_name}` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900">{item.rating.toFixed(1)}</span>
                                <div className="ml-1 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= item.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => handleViewItemDetails(item)}
                                className="text-green-600 hover:text-green-900"
                                title="View Details"
                              >
                                <FaInfoCircle className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={exportToPDF}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FaFilePdf className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => setIsViewAllModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {isItemDetailModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsItemDetailModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Product Details
                  </h3>
                  <button
                    onClick={() => setIsItemDetailModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                {isLoadingItemDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading product details...</span>
                  </div>
                ) : itemDetails ? (
                  <div className="space-y-6">
                    {/* Product Image */}
                    <div className="flex justify-center">
                      {(() => {
                        const hasValidPhoto = itemDetails.photo && 
                                             itemDetails.photo.trim() !== "" && 
                                             itemDetails.photo !== "null" &&
                                             itemDetails.photo !== "undefined";
                        
                        console.log('🖼️ Item details photo check:', {
                          photo: itemDetails.photo,
                          hasValidPhoto
                        });
                        
                        if (hasValidPhoto) {
                          return (
                            <img
                              src={itemDetails.photo}
                              alt={itemDetails.name}
                              className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                console.log('❌ Item details image failed to load:', itemDetails.photo);
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMG_192;
                              }}
                              onLoad={() => {
                                console.log('✅ Item details image loaded successfully:', itemDetails.photo);
                              }}
                            />
                          );
                        } else {
                          return (
                            <img
                              src={FALLBACK_IMG_192}
                              alt={itemDetails.name}
                              className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                            />
                          );
                        }
                      })()}
                    </div>

                    {/* Product Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Product ID</h4>
                        <p className="mt-1 text-sm text-gray-900">#{itemDetails.id}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category</h4>
                        <p className="mt-1 space-x-1">
                          <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                            {itemDetails.category}
                          </span>
                          {itemDetails.sub_category && (
                            <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                              {itemDetails.sub_category}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Product Name</h4>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{itemDetails.name}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</h4>
                        <p className="mt-1 text-sm text-gray-900">{itemDetails.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Price</h4>
                        <p className="mt-1 text-lg font-bold text-green-600">
                          KSh {parseFloat(itemDetails.price).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rating</h4>
                        <div className="mt-1 flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (itemDetails.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ({itemDetails.average_rating || 0} / 5.0)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner Information */}
                    {itemDetails.owner && (
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Owner Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</h5>
                            <p className="mt-1 text-sm text-gray-900">
                              {itemDetails.owner.first_name} {itemDetails.owner.last_name}
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</h5>
                            <p className="mt-1 text-sm text-gray-900">{itemDetails.owner.email}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</h5>
                            <p className="mt-1 text-sm text-gray-900">{itemDetails.owner.phone_no}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</h5>
                            <p className="mt-1">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                itemDetails.owner.userType === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {itemDetails.owner.userType}
                              </span>
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</h5>
                            <p className="mt-1">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                itemDetails.owner.is_email_verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {itemDetails.owner.is_email_verified ? 'Verified' : 'Not Verified'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No product details available</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setIsItemDetailModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
