import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter, 
  FaImage, 
  FaEye, 
  FaStar, 
  FaRegStar, 
  FaUpload,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sample product data with images
const sampleProducts = [
  { 
    id: 1, 
    name: 'Modern Sofa', 
    description: 'Luxurious modern sofa with premium fabric',
    category: 'Furniture', 
    price: 599.99, 
    stock: 15, 
    status: 'In Stock',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3a41c451e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  },
  { 
    id: 2, 
    name: 'Coffee Table', 
    description: 'Elegant wooden coffee table with glass top',
    category: 'Furniture', 
    price: 199.99, 
    stock: 8, 
    status: 'Low Stock',
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  },
  { 
    id: 3, 
    name: 'Desk Lamp', 
    description: 'Adjustable LED desk lamp with touch control',
    category: 'Lighting', 
    price: 49.99, 
    stock: 25, 
    status: 'In Stock',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e622d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  },
  { 
    id: 4, 
    name: 'Office Chair', 
    description: 'Ergonomic office chair with lumbar support',
    category: 'Furniture', 
    price: 179.99, 
    stock: 0, 
    status: 'Out of Stock',
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1505797149-43ae086f594f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  },
  { 
    id: 5, 
    name: 'Wall Art', 
    description: 'Modern abstract wall art painting',
    category: 'Decor', 
    price: 89.99, 
    stock: 12, 
    status: 'In Stock',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80'
    ]
  },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(sampleProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Furniture',
    price: '',
    stock: '',
    status: 'In Stock',
    images: []
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...newProduct,
      id: isEditing ? newProduct.id : products.length + 1,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      images: [...uploadedImages, ...(newProduct.images || [])]
    };

    if (isEditing) {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
      toast.success('Product updated successfully!');
    } else {
      setProducts([...products, productData]);
      toast.success('Product added successfully!');
    }

    // Reset form
    setNewProduct({
      name: '',
      description: '',
      category: 'Furniture',
      price: '',
      stock: '',
      status: 'In Stock',
      images: []
    });
    setUploadedImages([]);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setNewProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      images: product.images || []
    });
    setUploadedImages([]);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteModalOpen(false);
    toast.success('Product deleted successfully!');
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
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
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
          <button className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <FaPlus className="h-4 w-4" />
            <span>Add Product</span>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">#{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
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
                    <button className="mr-3 text-blue-600 hover:text-blue-900">
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
