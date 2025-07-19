import { motion } from 'framer-motion';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const FeaturedProducts = () => {
    // Mock product data - replace with your actual products
    const products = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: "$299",
            originalPrice: "$399",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            rating: 4.8,
            badge: "Best Seller"
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            price: "$199",
            originalPrice: "$249",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
            rating: 4.9,
            badge: "New"
        },
        {
            id: 3,
            name: "Professional Camera Lens",
            price: "$549",
            originalPrice: "$699",
            image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
            rating: 4.7,
            badge: "Sale"
        },
        {
            id: 4,
            name: "Ergonomic Office Chair",
            price: "$399",
            originalPrice: "$499",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
            rating: 4.6,
            badge: "Featured"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const productVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const getBadgeColor = (badge) => {
        switch (badge) {
            case 'Best Seller': return 'bg-orange-500/80';
            case 'New': return 'bg-green-500/80';
            case 'Sale': return 'bg-red-500/80';
            default: return 'bg-gray-600/80';
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        return (
            <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                    i < fullStars ? (
                        <AiFillStar
                            key={i}
                            size={16}
                            className="text-yellow-400"
                        />
                    ) : (
                        <AiOutlineStar
                            key={i}
                            size={16}
                            className="text-gray-300"
                        />
                    )
                ))}
            </div>
        );
    };

    return (
        <section className="py-20 bg-light-beige dark:bg-dark-beige">
            <div className="container mx-auto px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Products
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Discover our handpicked selection of premium products that customers love most
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
                            variants={productVariants}
                            whileHover={{ y: -5 }}
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getBadgeColor(product.badge)}`}>
                                    {product.badge}
                                </div>
                                <motion.button
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <AiFillHeart size={20} className="text-red-500 hover:text-red-600 transition-colors" />
                                </motion.button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center mb-2">
                                    {renderStars(product.rating)}
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                        ({product.rating})
                                    </span>
                                </div>

                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {product.price}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                            {product.originalPrice}
                                        </span>
                                    </div>
                                </div>

                                <motion.button
                                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <motion.button
                        className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All Products
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;