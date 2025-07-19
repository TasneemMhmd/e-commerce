import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 200);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg
                    bg-light-blush/90 dark:bg-dark-blush/90 
                    text-light-charcoal dark:text-dark-charcoal
                    hover:bg-light-blush dark:hover:bg-dark-blush
                    backdrop-blur-sm border border-light-peach/30 dark:border-dark-peach/30
                    transition-all duration-200"
                >
                    <FaArrowUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;