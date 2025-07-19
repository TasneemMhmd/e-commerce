import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    FaStar,
    FaQuoteLeft,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Business Owner",
            image:
                "https://images.unsplash.com/photo-1494790108755-2616b612b147?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            text: "Outstanding quality and exceptional service! The products exceeded my expectations and the customer support team was incredibly helpful throughout the entire process.",
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Creative Director",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            text: "I've been a loyal customer for over two years now. The attention to detail and commitment to excellence is what keeps me coming back. Highly recommended!",
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Marketing Manager",
            image:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            text: "Fast shipping, beautiful packaging, and products that actually work as advertised. This store has become my go-to for all my shopping needs.",
        },
        {
            id: 4,
            name: "David Kim",
            role: "Tech Entrepreneur",
            image:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            text: "The quality-to-price ratio is unbeatable. I've recommended this store to all my friends and colleagues. Keep up the fantastic work!",
        },
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    };

    // Auto-advance testimonials
    useEffect(() => {
        const timer = setInterval(nextTestimonial, 5000);
        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="py-20 bg-gradient-to-br from-light-blush/20 via-light-peach to-light-sage/20 dark:from-dark-blush/20 dark:via-dark-peach dark:to-dark-sage/20">
            <div className="container mx-auto px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-light-charcoal dark:text-dark-charcoal mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-light-charcoal/70 dark:text-dark-charcoal/70 max-w-2xl mx-auto">
                        Don't just take our word for it - hear from thousands of satisfied
                        customers
                    </p>
                </motion.div>

                {/* Featured Testimonial */}
                <motion.div
                    className="max-w-4xl mx-auto mb-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="relative">
                        <motion.div
                            key={currentIndex}
                            className="bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-3xl p-8 lg:p-12 text-center shadow-xl"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                        >
                            <FaQuoteLeft className="w-16 h-16 text-light-blush dark:text-dark-blush mx-auto mb-6" />

                            <p className="text-xl lg:text-2xl text-light-charcoal dark:text-dark-charcoal mb-8 leading-relaxed">
                                {testimonials[currentIndex].text}
                            </p>

                            <div className="flex items-center justify-center mb-6">
                                <img
                                    src={testimonials[currentIndex].image}
                                    alt={testimonials[currentIndex].name}
                                    className="w-16 h-16 rounded-full mr-4 object-cover"
                                />
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg text-light-charcoal dark:text-dark-charcoal">
                                        {testimonials[currentIndex].name}
                                    </h4>
                                    <p className="text-light-charcoal/70 dark:text-dark-charcoal/70">
                                        {testimonials[currentIndex].role}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-1">
                                {Array.from({ length: testimonials[currentIndex].rating }).map(
                                    (_, i) => (
                                        <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                                    )
                                )}
                            </div>
                        </motion.div>

                        {/* Navigation Arrows */}
                        <motion.button
                            onClick={prevTestimonial}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaChevronLeft className="w-6 h-6 text-light-charcoal dark:text-dark-charcoal" />
                        </motion.button>

                        <motion.button
                            onClick={nextTestimonial}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaChevronRight className="w-6 h-6 text-light-charcoal dark:text-dark-charcoal" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Testimonial Grid */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className={`bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all ${index === currentIndex
                                    ? "ring-2 ring-light-blush dark:ring-dark-blush"
                                    : ""
                                }`}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                            }}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full mr-3 object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-light-charcoal dark:text-dark-charcoal">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-light-charcoal/70 dark:text-dark-charcoal/70">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center mb-3">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-sm text-light-charcoal/80 dark:text-dark-charcoal/80 line-clamp-3">
                                {testimonial.text}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? "bg-light-blush dark:bg-dark-blush"
                                    : "bg-light-charcoal/30 dark:bg-dark-charcoal/30"
                                }`}
                        />
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-light-charcoal/20 dark:border-dark-charcoal/20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {[
                        { number: "10,000+", label: "Happy Customers" },
                        { number: "98%", label: "Satisfaction Rate" },
                        { number: "4.9/5", label: "Average Rating" },
                        { number: "24/7", label: "Customer Support" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-3xl lg:text-4xl font-bold text-light-charcoal dark:text-dark-charcoal mb-2">
                                {stat.number}
                            </div>
                            <div className="text-sm text-light-charcoal/70 dark:text-dark-charcoal/70">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
