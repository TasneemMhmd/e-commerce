import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiShoppingCart,
    FiHeart,
    FiStar,
    FiMinus,
    FiPlus,
    FiArrowLeft,
    FiLoader,
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiCheck,
} from "react-icons/fi";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Fetch product from Firebase
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productRef = doc(db, "products", id);
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const productData = { id: productSnap.id, ...productSnap.data() };
                    setProduct(productData);
                    
                    // If product has multiple images, set up image array
                    if (!productData.images && productData.image) {
                        productData.images = [productData.image];
                    }
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === "increase") {
            setQuantity(prev => prev + 1);
        } else if (type === "decrease" && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const features = [
        {
            icon: FiTruck,
            title: "Free Shipping",
            description: "Free shipping on orders over 500 EGP"
        },
        {
            icon: FiShield,
            title: "Quality Guarantee",
            description: "100% authentic products guaranteed"
        },
        {
            icon: FiRefreshCw,
            title: "Easy Returns",
            description: "30-day return policy"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-light-beige dark:bg-dark-beige transition-colors duration-200 flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 text-light-blush dark:text-dark-blush animate-spin mx-auto mb-4" />
                    <p className="text-light-charcoal dark:text-dark-charcoal text-lg">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-light-beige dark:bg-dark-beige transition-colors duration-200 flex items-center justify-center">
                <div className="text-center bg-light-peach/50 dark:bg-dark-peach/50 rounded-2xl p-8 max-w-md">
                    <p className="text-red-500 text-lg mb-4">{error || "Product not found"}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-light-blush dark:bg-dark-blush text-white rounded-lg hover:opacity-90 transition-opacity mr-3"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/shop")}
                            className="px-6 py-3 bg-light-sage dark:bg-dark-sage text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const productImages = product.images || [product.image];

    return (
        <div className="min-h-screen bg-light-beige dark:bg-dark-beige transition-colors duration-200">
            {/* Success Message */}
            <AnimatePresence>
                {showSuccessMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
                    >
                        <FiCheck className="w-5 h-5" />
                        <span>Added to cart successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-light-charcoal dark:text-dark-charcoal hover:text-light-blush dark:hover:text-dark-blush transition-colors mb-8 group"
                >
                    <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Products</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="relative overflow-hidden rounded-2xl bg-light-peach/30 dark:bg-dark-peach/30">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.title}
                                className="w-full h-96 lg:h-[500px] object-cover"
                            />
                            
                            {!product.inStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-semibold bg-red-500 px-6 py-3 rounded-full text-lg">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {productImages.length > 1 && (
                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                            selectedImage === index
                                                ? "border-light-blush dark:border-dark-blush"
                                                : "border-light-sage/30 dark:border-dark-sage/30"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Category and Rating */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-dark-sage dark:text-light-sage bg-light-beige/50 dark:bg-dark-beige/50 px-4 py-2 rounded-full capitalize">
                                {product.category}
                            </span>
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.floor(product.rating)
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-light-charcoal dark:text-dark-charcoal ml-2">
                                    ({product.rating})
                                </span>
                            </div>
                        </div>

                        {/* Title and Price */}
                        <div>
                            <h1 className="text-3xl font-bold text-light-charcoal dark:text-dark-charcoal mb-3">
                                {product.title}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-dark-sage dark:text-light-beige">
                                    {product.price} EGP
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-500 line-through">
                                        {product.originalPrice} EGP
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-light-peach/30 dark:bg-dark-peach/30 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-light-charcoal dark:text-dark-charcoal mb-3">
                                Description
                            </h3>
                            <p className="text-light-charcoal/80 dark:text-dark-charcoal/80 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="bg-light-peach/20 dark:bg-dark-peach/20 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-light-charcoal dark:text-dark-charcoal font-medium">
                                    Quantity:
                                </span>
                                <div className="flex items-center space-x-3 bg-white/50 dark:bg-black/20 rounded-lg p-2">
                                    <button
                                        onClick={() => handleQuantityChange("decrease")}
                                        disabled={quantity <= 1}
                                        className="p-1 rounded-md hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiMinus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange("increase")}
                                        className="p-1 rounded-md hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                                        product.inStock
                                            ? "bg-light-sage dark:bg-dark-sage text-white hover:bg-light-blush dark:hover:bg-dark-blush shadow-lg"
                                            : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    <FiShoppingCart className="w-5 h-5" />
                                    <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleWishlist}
                                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                        isWishlisted
                                            ? "border-light-blush dark:border-dark-blush bg-light-blush/20 dark:bg-dark-blush/20"
                                            : "border-light-sage/30 dark:border-dark-sage/30 hover:border-light-blush dark:hover:border-dark-blush"
                                    }`}
                                >
                                    <FiHeart 
                                        className={`w-6 h-6 ${
                                            isWishlisted 
                                                ? "text-light-blush dark:text-dark-blush fill-current" 
                                                : "text-light-charcoal dark:text-dark-charcoal"
                                        }`} 
                                    />
                                </motion.button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center space-x-4 p-4 bg-light-peach/20 dark:bg-dark-peach/20 rounded-xl"
                                >
                                    <div className="p-2 bg-light-sage/20 dark:bg-dark-sage/20 rounded-lg">
                                        <feature.icon className="w-5 h-5 text-light-sage dark:text-dark-sage" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-light-charcoal dark:text-dark-charcoal">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-light-charcoal/70 dark:text-dark-charcoal/70">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;