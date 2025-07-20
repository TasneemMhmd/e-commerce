import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FiShoppingCart,
    FiHeart,
    FiStar,
    FiFilter,
    FiSearch,
    FiGrid,
    FiList,
    FiLoader,
    FiChevronDown,
} from "react-icons/fi";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; 

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [viewMode, setViewMode] = useState("grid");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    
    const categoryDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch products from Firebase (memoized to prevent re-fetching)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const productsRef = collection(db, "products");
                const q = query(productsRef, orderBy("title"));
                const querySnapshot = await getDocs(q);

                const productsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setProducts(productsData);

                if (productsData.length > 0) {
                    const prices = productsData.map((p) => p.price);
                    setPriceRange([Math.min(...prices), Math.max(...prices)]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array - only fetch once

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Memoized categories to prevent recalculation
    const categories = useMemo(() => [
        "all",
        ...new Set(products.map((product) => product.category)),
    ], [products]);

    // Memoized sort options
    const sortOptions = useMemo(() => [
        { value: "title", label: "Sort by Name" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "rating", label: "Highest Rated" },
    ], []);

    // Memoized filtered and sorted products
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                const matchesSearch =
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory =
                    selectedCategory === "all" || product.category === selectedCategory;
                const matchesPrice =
                    product.price >= priceRange[0] && product.price <= priceRange[1];

                return matchesSearch && matchesCategory && matchesPrice;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low":
                        return a.price - b.price;
                    case "price-high":
                        return b.price - a.price;
                    case "rating":
                        return b.rating - a.rating;
                    case "title":
                    default:
                        return a.title.localeCompare(b.title);
                }
            });
    }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

    // Memoized animation variants
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }), []);

    const dropdownVariants = useMemo(() => ({
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.2 },
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.2, staggerChildren: 0.05 },
        },
    }), []);

    const dropdownItemVariants = useMemo(() => ({
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    }), []);

    // Memoized event handlers to prevent unnecessary re-renders
const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
}, [navigate]);
    const handleAddToCart = useCallback((e, product) => {
        e.stopPropagation();
        // Handle add to cart logic
        console.log("Added to cart:", product);
    }, []);

    const handleAddToWishlist = useCallback((e, product) => {
        e.stopPropagation();
        // Handle add to wishlist logic
        console.log("Added to wishlist:", product);
    }, []);

    // Memoized ProductCard component
    const ProductCard = useMemo(() => React.memo(({ product }) => (
        <motion.div
            variants={itemVariants}
            onClick={() => handleProductClick(product.id)}
            className="bg-light-peach/50 dark:bg-dark-peach/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-light-sage/20 dark:border-dark-sage/20 cursor-pointer group"
        >
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 space-y-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleAddToWishlist(e, product)}
                        className="p-2 bg-white/90 dark:bg-black/90 rounded-full shadow-lg hover:bg-light-blush/90 dark:hover:bg-dark-blush/90 transition-colors"
                    >
                        <FiHeart className="w-4 h-4 text-light-charcoal dark:text-dark-charcoal" />
                    </motion.button>
                </div>
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dark-sage dark:text-light-sage bg-light-beige/50 dark:bg-dark-beige/50 px-3 py-1 rounded-full capitalize">
                        {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-light-charcoal dark:text-dark-charcoal">
                            {product.rating}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-light-charcoal dark:text-dark-charcoal mb-2">
                    {product.title}
                </h3>

                <p className="text-sm text-light-charcoal/70 dark:text-dark-charcoal/70 mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-dark-sage/70 dark:text-light-beige">
                        {product.price} EGP
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${product.inStock
                                ? "bg-light-sage dark:bg-dark-sage text-white hover:bg-light-blush dark:hover:bg-dark-blush shadow-lg"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <FiShoppingCart className="w-4 h-4" />
                        <span>{product.inStock ? "Add to Cart" : "Sold Out"}</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )), [itemVariants, handleProductClick, handleAddToWishlist, handleAddToCart]);

    // Memoized ProductListItem component
    const ProductListItem = useMemo(() => React.memo(({ product }) => (
        <motion.div
            variants={itemVariants}
            onClick={() => handleProductClick(product.id)}
            className="bg-light-peach/50 dark:bg-dark-peach/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-light-sage/20 dark:border-dark-sage/20 flex cursor-pointer group"
        >
            <div className="relative w-48 h-32 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="flex-1 p-6 flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-light-sage dark:text-dark-sage bg-light-beige/50 dark:bg-dark-beige/50 px-3 py-1 rounded-full capitalize">
                            {product.category}
                        </span>
                        <div className="flex items-center space-x-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-light-charcoal dark:text-dark-charcoal">
                                {product.rating}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-light-charcoal dark:text-dark-charcoal mb-2">
                        {product.title}
                    </h3>

                    <p className="text-sm text-light-charcoal/70 dark:text-dark-charcoal/70 mb-4">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-light-blush dark:text-dark-blush">
                        {product.price} EGP
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${product.inStock
                                ? "bg-light-sage dark:bg-dark-sage text-white hover:bg-light-blush dark:hover:bg-dark-blush shadow-lg"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <FiShoppingCart className="w-5 h-5" />
                        <span>{product.inStock ? "Add to Cart" : "Sold Out"}</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )), [itemVariants, handleProductClick, handleAddToCart]);

    if (loading) {
        return (
            <div className="min-h-screen bg-light-beige dark:bg-dark-beige transition-colors duration-200 flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 text-light-blush dark:text-dark-blush animate-spin mx-auto mb-4" />
                    <p className="text-light-charcoal dark:text-dark-charcoal text-lg">
                        Loading products...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-light-beige dark:bg-dark-beige transition-colors duration-200 flex items-center justify-center">
                <div className="text-center bg-light-peach/50 dark:bg-dark-peach/50 rounded-2xl p-8 max-w-md">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-light-blush dark:bg-dark-blush text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-beige dark:bg-dark-beige transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-light-charcoal dark:text-dark-charcoal mb-4">
                        Our Products
                    </h1>
                    <p className="text-light-charcoal/70 dark:text-dark-charcoal/70 text-lg max-w-2xl mx-auto">
                        Discover our collection of premium beauty products crafted with care
                        and quality.
                    </p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-light-peach/30 dark:bg-dark-peach/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-light-sage/20 dark:border-dark-sage/20 relative z-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-charcoal/50 dark:text-dark-charcoal/50" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-sage/30 dark:border-dark-sage/30 focus:border-light-blush dark:focus:border-dark-blush focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative" ref={categoryDropdownRef}>
                            <motion.button
                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-sage/30 dark:border-dark-sage/30 focus:border-light-blush dark:focus:border-dark-blush focus:outline-none transition-all duration-200 relative overflow-hidden group flex items-center justify-between text-left"
                                aria-expanded={isCategoryDropdownOpen}
                                aria-haspopup="true"
                            >
                                <span className="capitalize">
                                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                                </span>
                                <motion.div
                                    animate={{ rotate: isCategoryDropdownOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiChevronDown className="w-4 h-4" />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {isCategoryDropdownOpen && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={dropdownVariants}
                                        className="absolute top-full left-0 right-0 mt-2 bg-light-peach/95 dark:bg-dark-peach/95 backdrop-blur-md rounded-lg shadow-xl border border-light-sage/20 dark:border-dark-sage/20 py-2 z-[100]"
                                    >
                                        {categories.map((category) => (
                                            <motion.div
                                                key={category}
                                                variants={dropdownItemVariants}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory(category);
                                                        setIsCategoryDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 transition-all duration-200 capitalize"
                                                >
                                                    {category === "all" ? "All Categories" : category}
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative" ref={sortDropdownRef}>
                            <motion.button
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-sage/30 dark:border-dark-sage/30 focus:border-light-blush dark:focus:border-dark-blush focus:outline-none transition-all duration-200 relative overflow-hidden group flex items-center justify-between text-left"
                                aria-expanded={isSortDropdownOpen}
                                aria-haspopup="true"
                            >
                                <span>
                                    {sortOptions.find(option => option.value === sortBy)?.label || "Sort by Name"}
                                </span>
                                <motion.div
                                    animate={{ rotate: isSortDropdownOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiChevronDown className="w-4 h-4" />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {isSortDropdownOpen && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={dropdownVariants}
                                        className="absolute top-full left-0 right-0 mt-2 bg-light-peach/95 dark:bg-dark-peach/95 backdrop-blur-md rounded-lg shadow-xl border border-light-sage/20 dark:border-dark-sage/20 py-2 z-[100]"
                                    >
                                        {sortOptions.map((option) => (
                                            <motion.div
                                                key={option.value}
                                                variants={dropdownItemVariants}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setIsSortDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 transition-all duration-200"
                                                >
                                                    {option.label}
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-white/50 dark:bg-black/20 rounded-lg border border-light-sage/30 dark:border-dark-sage/30 overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`flex-1 px-4 py-3 flex items-center justify-center transition-colors ${viewMode === "grid"
                                        ? "bg-light-blush dark:bg-dark-blush text-white"
                                        : "text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20"
                                    }`}
                            >
                                <FiGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex-1 px-4 py-3 flex items-center justify-center transition-colors ${viewMode === "list"
                                        ? "bg-light-blush dark:bg-dark-blush text-white"
                                        : "text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20"
                                    }`}
                            >
                                <FiList className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-light-charcoal/70 dark:text-dark-charcoal/70">
                        <span>
                            Showing {filteredProducts.length} of {products.length} products
                        </span>
                    </div>
                </motion.div>

                {/* Products Grid/List */}
                <AnimatePresence>
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="bg-light-peach/50 dark:bg-dark-peach/50 rounded-2xl p-8 max-w-md mx-auto">
                                <FiFilter className="w-16 h-16 text-light-charcoal/30 dark:text-dark-charcoal/30 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-light-charcoal dark:text-dark-charcoal mb-2">
                                    No products found
                                </h3>
                                <p className="text-light-charcoal/70 dark:text-dark-charcoal/70">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                    : "space-y-4"
                            }
                        >
                            {filteredProducts.map((product) =>
                                viewMode === "grid" ? (
                                    <ProductCard key={product.id} product={product} />
                                ) : (
                                    <ProductListItem key={product.id} product={product} />
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Products;