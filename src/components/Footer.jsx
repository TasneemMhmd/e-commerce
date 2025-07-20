import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import light from '/src/assets/images/light.png';
import dark from '/src/assets/images/dark.png';

const Footer = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
        } else {
            setIsDark(false);
        }

        // Listen for theme changes
        const handleThemeChange = () => {
            const newTheme = localStorage.getItem('theme');
            const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(newTheme === 'dark' || (!newTheme && systemPrefers));
        };

        window.addEventListener('storage', handleThemeChange);
        return () => window.removeEventListener('storage', handleThemeChange);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    const socialLinks = [
        { icon: FiInstagram, href: '#', label: 'Instagram' },
        { icon: FiFacebook, href: '#', label: 'Facebook' },
        { icon: FiTwitter, href: '#', label: 'Twitter' },
    ];

    const quickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
    ];

    const categories = [
        { name: 'Skincare', href: '/categories/skincare' },
        { name: 'Makeup', href: '/categories/makeup' },
        { name: 'Beauty Tools', href: '/categories/beauty-tools' },
        { name: 'Self-Love', href: '/categories/self-love' }
    ];

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="bg-light-peach dark:bg-dark-peach border-t border-light-sage/30 dark:border-dark-sage/30 relative overflow-hidden"
        >
            {/* Background decoration */}
            <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: isDark
                        ? 'radial-gradient(circle at 20% 20%, #3a1f21 0%, transparent 50%), radial-gradient(circle at 80% 80%, #37413a 0%, transparent 50%)'
                        : 'radial-gradient(circle at 20% 20%, #edafb8 0%, transparent 50%), radial-gradient(circle at 80% 80%, #b0c4b1 0%, transparent 50%)'
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <AnimatePresence mode="wait" initial={false}>
                            {/* <motion.img
                                key={isDark ? 'dark-logo' : 'light-logo'}
                                src={isDark ? dark : light}
                                alt="Logo"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="h-12 w-auto object-contain"
                            /> */}
                                                            <img
                                                                src= {light}
                                                                className="block dark:hidden h-12 w-auto"
                                                            />
                                                            <img
                                                                src={dark}
                                                                className="hidden dark:block h-12 w-auto"
                                                            />
                        </AnimatePresence>
                        <p className="text-light-charcoal dark:text-dark-charcoal text-sm mb-4 leading-relaxed">
                            Discover your beauty journey with premium skincare and makeup products that celebrate your unique glow.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 bg-light-sage dark:bg-dark-sage text-white rounded-lg hover:bg-light-blush dark:hover:bg-dark-blush transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <IconComponent className="w-4 h-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <h3 className="text-dark-sage dark:text-light-sage text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <motion.li
                                    key={link.name}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={link.href}
                                        className="text-light-charcoal dark:text-dark-charcoal hover:text-light-blush dark:hover:text-dark-blush transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Categories */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <h3 className="text-dark-sage dark:text-light-sage text-lg font-semibold mb-4">
                            Categories
                        </h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <motion.li
                                    key={category.name}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={category.href}
                                        className="text-light-charcoal dark:text-dark-charcoal hover:text-light-blush dark:hover:text-dark-blush transition-colors duration-200 text-sm"
                                    >
                                        {category.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <h3 className="text-dark-sage dark:text-light-sage text-lg font-semibold mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-3">
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center space-x-3 text-light-charcoal dark:text-dark-charcoal"
                            >
                                <div className="p-1.5 bg-light-sage/20 dark:bg-dark-sage/20 rounded-md">
                                    <FiMail className="w-4 h-4 text-dark-sage dark:text-light-sage" />
                                </div>
                                <span className="text-sm">hello@nema.com</span>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center space-x-3 text-light-charcoal dark:text-dark-charcoal"
                            >
                                <div className="p-1.5 bg-light-sage/20 dark:bg-dark-sage/20 rounded-md">
                                    <FiPhone className="w-4 h-4 text-dark-sage dark:text-light-sage" />
                                </div>
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-start space-x-3 text-light-charcoal dark:text-dark-charcoal"
                            >
                                <div className="p-1.5 bg-light-sage/20 dark:bg-dark-sage/20 rounded-md mt-0.5">
                                    <FiMapPin className="w-4 h-4 text-dark-sage dark:text-light-sage" />
                                </div>
                                <span className="text-sm leading-relaxed">
                                    123 Beauty Street<br />
                                    New York, NY 10001
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-6 border-t border-light-sage/30 dark:border-dark-sage/30"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <motion.p
                            className="text-light-charcoal dark:text-dark-charcoal text-sm flex items-center space-x-1"
                            whileHover={{ scale: 1.02 }}
                        >
                            <span>© 2025 Nema. Made with</span>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                                <FiHeart className="w-4 h-4 text-light-blush dark:text-dark-blush fill-current" />
                            </motion.span>
                            <span>for beauty lovers.</span>
                        </motion.p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                            <Link
                                to="/privacy"
                                className="text-light-charcoal dark:text-dark-charcoal hover:text-light-sage dark:hover:text-light-sage transition-colors duration-200"
                            >
                                Privacy
                            </Link>
                            <Link
                                to="/terms"
                                className="text-light-charcoal dark:text-dark-charcoal hover:text-light-sage dark:hover:text-light-sage transition-colors duration-200"
                            >
                                Terms
                            </Link>
                            <Link
                                to="/cookies"
                                className="text-light-charcoal dark:text-dark-charcoal hover:text-light-sage dark:hover:text-light-sage transition-colors duration-200"
                            >
                                Cookies
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;