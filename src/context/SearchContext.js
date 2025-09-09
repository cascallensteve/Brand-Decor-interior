import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

const allProducts = [
  {
    id: 1,
    name: 'AmazonBasics 2-Seater Sofa',
    price: 16250.00,
    originalPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: true,
    category: 'Sofas'
  },
  {
    id: 2,
    name: 'Modern Dining Chair',
    price: 8500.00,
    originalPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: false,
    category: 'Dining Chair'
  },
  {
    id: 3,
    name: 'Scandinavian Coffee Table',
    price: 12500.00,
    originalPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: false,
    category: 'Table'
  },
  {
    id: 4,
    name: 'Luxury Armchair',
    price: 18750.00,
    originalPrice: 22500.00,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: true,
    category: 'Living Room'
  },
  {
    id: 5,
    name: 'Modern Floor Lamp',
    price: 7500.00,
    originalPrice: null,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: false,
    category: 'Wall Lamp'
  },
  {
    id: 6,
    name: 'Velvet Ottoman',
    price: 9500.00,
    originalPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1565689386310-8b26ef71b11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: false,
    category: 'Furniture'
  },
  {
    id: 7,
    name: '3-Seater Yellow Sofa',
    price: 25000.00,
    originalPrice: 30000.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: true,
    category: 'Sofas'
  },
  {
    id: 8,
    name: 'Executive Office Chair',
    price: 15000.00,
    originalPrice: null,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: false,
    category: 'Dining Chair'
  },
  {
    id: 9,
    name: 'Wooden Dining Table',
    price: 32500.00,
    originalPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    sale: false,
    category: 'Dining Room'
  }
];

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchProducts = (query) => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getSearchResults = () => {
    return searchProducts(searchQuery);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const value = {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    openSearch,
    closeSearch,
    searchProducts,
    getSearchResults,
    allProducts
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
