import React, { useState, useEffect, useRef } from "react";
// Note: Replace with your routing solution (Link component)
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSun,
    FiMoon,
    FiMenu,
    FiX,
    FiChevronDown,
    FiShoppingCart,
    FiHeart,
    FiUser,
} from "react-icons/fi";
import light from "/src/assets/images/light.png";
import dark from "/src/assets/images/dark.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getAuth, signOut } from "firebase/auth";
import { logout } from "../redux/authSlice";

const Navbar = () => {
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const dropdownRef = useRef(null);
    const auth = getAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const categories = [
        { name: "Skincare", href: "/categories/skincare" },
        { name: "Haircare", href: "/categories/haircare" },
        { name: "Bodycare", href: "/categories/bodycare" },
        { name: "Perfumes", href: "/categories/perfumes" },
        { name: "Makeup", href: "/categories/makeup" },
        { name: "Beauty Tools", href: "/categories/beauty-tools" },
    ];

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Offers", href: "/offer" },
        { name: "Contact", href: "/contact" },
    ];

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoriesOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);

        document.documentElement.classList.toggle("dark", newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 },
        },
    };

    const linkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3, when: "afterChildren" },
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const mobileItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 },
    };

    const dropdownVariants = {
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
            transition: { duration: 0.2, staggerChildren: 0.1 },
        },
    };

    const categoryItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className="sticky top-0 z-50 bg-light-peach/80 dark:bg-dark-peach/80 backdrop-blur-md border-b border-light-sage/20 dark:border-dark-sage/20 transition-colors duration-200"
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.button
                        variants={linkVariants}
                        className="flex-shrink-0"
                        onClick={() => navigate("/")}
                        aria-label="Go to home page"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                                key={isDark ? "dark-logo" : "light-logo"}
                                src={isDark ? dark : light}
                                alt="Logo"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="h-12 w-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                            />
                        </AnimatePresence>
                    </motion.button>

                    {/* Desktop Navigation */}
                    <motion.div variants={linkVariants} className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link, index) => (
                                <React.Fragment key={link.name}>
                                    <motion.div variants={linkVariants}>
                                        <button
                                            onClick={() => {
                                                navigate(link.href);
                                            }}
                                            className="text-light-charcoal dark:text-dark-charcoal hover:text-light-sage dark:hover:text-light-beige px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden group"
                                        >
                                            <span className="relative z-10">{link.name}</span>
                                            <motion.div
                                                className="absolute inset-0 bg-light-blush/20 dark:bg-dark-blush/20 rounded-md"
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileHover={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </button>
                                    </motion.div>
                                    {link.name === "Shop" && (
                                        <motion.div
                                            variants={linkVariants}
                                            className="relative"
                                            ref={dropdownRef}
                                        >
                                            <motion.button
                                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                                className="text-light-charcoal dark:text-dark-charcoal hover:text-light-sage dark:hover:text-light-beige  px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden group flex items-center space-x-1"
                                                aria-expanded={isCategoriesOpen}
                                                aria-haspopup="true"
                                            >
                                                <span className="relative z-10">Categories</span>
                                                <motion.div
                                                    animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="relative z-10"
                                                >
                                                    <FiChevronDown className="w-4 h-4" />
                                                </motion.div>
                                                <motion.div
                                                    className="absolute inset-0 bg-light-blush/20 dark:bg-dark-blush/20 rounded-md"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    whileHover={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            </motion.button>

                                            <AnimatePresence>
                                                {isCategoriesOpen && (
                                                    <motion.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                        variants={dropdownVariants}
                                                        className="absolute top-full left-0 mt-2 w-48 bg-light-peach/95 dark:bg-dark-peach/95 backdrop-blur-md rounded-lg shadow-xl border border-light-sage/20 dark:border-dark-sage/20 py-2"
                                                    >
                                                        {categories.map((category) => (
                                                            <motion.div
                                                                key={category.name}
                                                                variants={categoryItemVariants}
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        setIsCategoriesOpen(false);
                                                                        navigate(category.href);
                                                                    }}
                                                                    className="block w-full text-left px-4 py-2 text-sm text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 transition-all duration-200"
                                                                >
                                                                    {category.name}
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex items-center space-x-2">
                        <motion.button
                            aria-label="View favorites"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 flex items-center justify-center rounded-full bg-light-sage/20 dark:bg-dark-sage/20 text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/30 dark:hover:bg-dark-sage/30 transition-all duration-300 relative"
                        >
                            <FiHeart className="w-5 h-5" />
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-light-blush dark:bg-dark-blush text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                            >
                                3
                            </motion.span>
                        </motion.button>

                        <motion.button
                            aria-label="View cart"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 flex items-center justify-center rounded-full bg-light-sage/20 dark:bg-dark-sage/20 text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/30 dark:hover:bg-dark-sage/30 transition-all duration-300 relative"
                        >
                            <FiShoppingCart className="w-5 h-5" />
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-light-blush dark:bg-dark-blush text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                            >
                                2
                            </motion.span>
                        </motion.button>

                        <motion.button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 flex items-center justify-center rounded-full bg-light-sage/20 dark:bg-dark-sage/20 text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/30 dark:hover:bg-dark-sage/30 transition-all duration-300"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isDark ? "moon" : "sun"}
                                    initial={{ y: -30, opacity: 0, rotate: -90 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 30, opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-5 h-5 flex items-center justify-center"
                                >
                                    {isDark ? <FiMoon /> : <FiSun />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="md:hidden p-2 flex items-center justify-center rounded-full bg-light-sage/20 dark:bg-dark-sage/20 text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/30 dark:hover:bg-dark-sage/30 transition-all duration-300"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isMobileMenuOpen ? "close" : "menu"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-5 h-5 flex items-center justify-center"
                                >
                                    {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                        <motion.div variants={linkVariants} className="hidden md:block">
                            {isAuthenticated && user ? (
                                <>
                                    <span className="text-light-charcoal dark:text-dark-charcoal">
                                        Welcome, {user.displayName || user.email}
                                    </span>{" "}
                                    <button
                                        onClick={handleLogout}
                                        className="bg-light-blush dark:bg-dark-blush text-light-charcoal dark:text-light-beige px-4 py-2 rounded-lg hover:bg-light-beige dark:hover:bg-dark-peach transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 bg-gradient-to-r from-light-blush to-light-sage text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <FiUser className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={mobileMenuVariants}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 bg-light-beige/50 dark:bg-dark-beige/50 rounded-lg mt-2 backdrop-blur-sm">
                                <motion.div variants={mobileItemVariants} className="px-3 pb-3">
                                    {isAuthenticated && user ? (
                                        <div className="space-y-3">
                                            <div className="text-center">
                                                <div className="text-light-charcoal dark:text-dark-charcoal text-sm font-medium">
                                                    Welcome, {user.displayName || user.email}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full px-4 py-3 bg-light-blush dark:bg-dark-blush text-light-charcoal dark:text-light-beige font-medium rounded-lg hover:bg-light-beige dark:hover:bg-dark-peach transition-all duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <FiUser className="w-5 h-5" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-light-blush to-light-sage dark:from-dark-blush dark:to-dark-sage text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                                        >
                                            <FiUser className="w-5 h-5" />
                                            <span>Login to Your Account</span>
                                        </Link>
                                    )}
                                </motion.div>
                                <motion.div
                                    variants={mobileItemVariants}
                                    className="border-t border-light-sage/20 dark:border-dark-sage/20 pt-2"
                                />
                                {navLinks.map((link) => (
                                    <motion.div key={link.name} variants={mobileItemVariants}>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                navigate(link.href);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 transition-all duration-200"
                                        >
                                            {link.name}
                                        </button>
                                    </motion.div>
                                ))}
                                <motion.div
                                    variants={mobileItemVariants}
                                    className="border-t border-light-sage/20 dark:border-dark-sage/20 pt-2 mt-2"
                                >
                                    <div className="px-3 py-1 text-xs font-semibold text-light-sage dark:text-dark-sage uppercase tracking-wider">
                                        Categories
                                    </div>
                                    {categories.map((category) => (
                                        <motion.div
                                            key={category.name}
                                            variants={mobileItemVariants}
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    navigate(category.href);
                                                }}
                                                className="block w-full text-left px-6 py-2 rounded-md text-base font-medium text-light-charcoal dark:text-dark-charcoal hover:bg-light-sage/20 dark:hover:bg-dark-sage/20 transition-all duration-200"
                                            >
                                                {category.name}
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className="absolute inset-0 -z-10 opacity-10"
                animate={{
                    backgroundImage: isDark
                        ? "radial-gradient(circle at 20% 80%, #3a1f21 0%, transparent 50%), radial-gradient(circle at 80% 20%, #37413a 0%, transparent 50%)"
                        : "radial-gradient(circle at 20% 80%, #edafb8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #b0c4b1 0%, transparent 50%)",
                }}
                transition={{ duration: 0.5 }}
            />
        </motion.nav>
    );
};

export default Navbar;
