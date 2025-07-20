import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import register from "/src/assets/images/register.png";
import light from "/src/assets/images/light.png";
import dark from "/src/assets/images/dark.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Register = () => {
    const [isDark, setIsDark] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
        newsletter: false,
    });

    const navigate = useNavigate();

    // Check theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // Validation functions
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;
    const validateName = (name) => name.trim().length >= 2;

    // Real-time validation
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        
        setFormData((prev) => ({ ...prev, [name]: newValue }));

        // Clear previous errors and messages
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (message.text) {
            setMessage({ type: "", text: "" });
        }

        // Real-time validation
        if (name === "email" && value) {
            setErrors((prev) => ({ 
                ...prev, 
                email: validateEmail(value) ? "" : "Please enter a valid email address" 
            }));
        }

        if (name === "password" && value) {
            setErrors((prev) => ({ 
                ...prev, 
                password: validatePassword(value) ? "" : "Password must be at least 6 characters long" 
            }));
            
            // Check confirm password match if it exists
            if (formData.confirmPassword) {
                setErrors((prev) => ({ 
                    ...prev, 
                    confirmPassword: value === formData.confirmPassword ? "" : "Passwords do not match" 
                }));
            }
        }

        if (name === "confirmPassword" && value) {
            setErrors((prev) => ({ 
                ...prev, 
                confirmPassword: value === formData.password ? "" : "Passwords do not match" 
            }));
        }

        if ((name === "firstName" || name === "lastName") && value) {
            setErrors((prev) => ({ 
                ...prev, 
                [name]: validateName(value) ? "" : "Name must be at least 2 characters long" 
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) {
            newErrors.firstName = "First name is required";
        } else if (!validateName(formData.firstName)) {
            newErrors.firstName = "Name must be at least 2 characters long";
        }

        if (!formData.lastName) {
            newErrors.lastName = "Last name is required";
        } else if (!validateName(formData.lastName)) {
            newErrors.lastName = "Name must be at least 2 characters long";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "You must agree to the terms";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`,
            });

            setMessage({ 
                type: "success", 
                text: "Account created successfully! Welcome to Nema! 🌸" 
            });

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            console.error("Registration error:", error.message);
            
            let errorMessage = "Registration failed. Please try again.";
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already registered.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address format.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password is too weak. Please choose a stronger password.";
                    break;
                default:
                    errorMessage = error.message;
            }
            
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    // Message component
    const MessageAlert = ({ message }) => (
        <AnimatePresence>
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex items-center p-4 rounded-xl mb-4 ${
                        message.type === "success"
                            ? "bg-light-sage/20 dark:bg-light-sage/50 border border-light-sage/30 dark:border-dark-sage/50"
                            : "bg-light-blush/20 dark:bg-light-blush/50 border border-light-blush/30 dark:border-dark-blush/50"
                    }`}
                >
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: message.type === "success" ? 360 : 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`mr-3 ${
                            message.type === "success"
                                ? "text-light-sage dark:text-dark-sage"
                                : "text-light-blush dark:text-dark-blush"
                        }`}
                    >
                        {message.type === "success" ? (
                            <FaCheckCircle size={20} />
                        ) : (
                            <FaExclamationTriangle size={20} />
                        )}
                    </motion.div>
                    <p className={`text-sm font-medium ${
                        message.type === "success"
                            ? "text-light-sage dark:text-dark-sage"
                            : "text-light-blush dark:text-dark-blush"
                    }`}>
                        {message.text}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-light-peach via-light-beige to-light-blush dark:from-dark-beige dark:via-dark-sage dark:to-dark-peach">
            {/* Left Section - Form */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex items-center justify-center p-8 lg:p-12"
            >
                <div className="w-full max-w-md">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="flex justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} className="relative">
                                <img src={light} className="block dark:hidden w-32" />
                                <img src={dark} className="hidden dark:block w-32" />
                            </motion.div>
                        </div>

                        <h1 className="text-3xl font-bold text-light-charcoal dark:text-dark-charcoal mb-2">
                            Join Nema
                        </h1>
                        <p className="text-light-charcoal/80 dark:text-dark-charcoal/80">
                            Create your beauty journey today
                        </p>
                    </motion.div>

                    {/* Message Alert */}
                    <MessageAlert message={message} />

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${
                                        errors.firstName
                                            ? 'border-2 border-light-blush focus:ring-light-blush/50 dark:focus:ring-dark-blush/50'
                                            : 'border border-light-sage/30 dark:border-dark-peach/30 focus:ring-light-blush dark:focus:ring-dark-blush'
                                    }`}
                                    placeholder="First name"
                                />
                                <AnimatePresence>
                                    {errors.firstName && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-1 text-sm text-light-blush"
                                        >
                                            {errors.firstName}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${
                                        errors.lastName
                                            ? 'border-2 border-light-blush focus:ring-light-blush/50 dark:focus:ring-dark-blush/50'
                                            : 'border border-light-sage/30 dark:border-dark-peach/30 focus:ring-light-blush dark:focus:ring-dark-blush'
                                    }`}
                                    placeholder="Last name"
                                />
                                <AnimatePresence>
                                    {errors.lastName && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-1 text-sm text-light-blush"
                                        >
                                            {errors.lastName}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="relative"
                        >
                            <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                    errors.email 
                                        ? 'text-light-blush dark:text-dark-blush' 
                                        : 'text-light-sage'
                                }`} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-4 py-4 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${
                                        errors.email
                                            ? 'border-2 border-light-blush focus:ring-light-blush/50 dark:focus:ring-dark-blush/50'
                                            : 'border border-light-sage/30 dark:border-dark-peach/30 focus:ring-light-blush dark:focus:ring-dark-blush'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-1 text-sm text-light-blush"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Password Fields */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="relative"
                        >
                            <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                    errors.password 
                                        ? 'text-light-blush dark:text-dark-blush' 
                                        : 'text-light-sage'
                                }`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-12 py-4 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${
                                        errors.password
                                            ? 'border-2 border-light-blush focus:ring-light-blush/50 dark:focus:ring-dark-blush/50'
                                            : 'border border-light-sage/30 dark:border-dark-peach/30 focus:ring-light-blush dark:focus:ring-dark-blush'
                                    }`}
                                    placeholder="Create password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light-sage hover:text-light-blush dark:hover:text-dark-blush transition-colors duration-200"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-1 text-sm text-light-blush"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="relative"
                        >
                            <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                    errors.confirmPassword 
                                        ? 'text-light-blush dark:text-dark-blush' 
                                        : 'text-light-sage'
                                }`} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-12 py-4 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${
                                        errors.confirmPassword
                                            ? 'border-2 border-light-blush focus:ring-light-blush/50 dark:focus:ring-dark-blush/50'
                                            : 'border border-light-sage/30 dark:border-dark-peach/30 focus:ring-light-blush dark:focus:ring-dark-blush'
                                    }`}
                                    placeholder="Confirm password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light-sage hover:text-light-blush dark:hover:text-dark-blush transition-colors duration-200"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-1 text-sm text-light-blush"
                                    >
                                        {errors.confirmPassword}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Checkboxes */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 mt-1 text-light-blush dark:text-dark-blush bg-light-beige dark:bg-dark-sage border-light-sage dark:border-dark-peach rounded focus:ring-light-blush dark:focus:ring-dark-blush focus:ring-2"
                                    />
                                    <span className="ml-3 text-sm text-light-charcoal/80 dark:text-dark-charcoal/80">
                                        I agree to the{" "}
                                        <button
                                            type="button"
                                            className="text-light-blush hover:text-light-peach transition-colors duration-200"
                                        >
                                            Terms of Service
                                        </button>{" "}
                                        and{" "}
                                        <button
                                            type="button"
                                            className="text-light-blush hover:text-light-peach transition-colors duration-200"
                                        >
                                            Privacy Policy
                                        </button>
                                    </span>
                                </label>
                                <AnimatePresence>
                                    {errors.agreeTerms && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-1 text-sm text-light-blush"
                                        >
                                            {errors.agreeTerms}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="w-full py-4 bg-gradient-to-r from-light-blush to-light-peach dark:from-dark-blush dark:to-dark-peach text-light-charcoal dark:text-dark-charcoal font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <motion.div
                                    className="flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Creating Account...
                                </motion.div>
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>
                    </motion.form>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="text-center mt-8"
                    >
                        <p className="text-light-charcoal/80 dark:text-dark-charcoal/80 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-light-charcoal dark:text-light-blush hover:text-dark-peach dark:hover:text-light-peach font-medium transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:flex lg:flex-1 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-light-blush/20 via-light-peach/20 to-light-sage/20 dark:from-dark-blush/20 dark:via-dark-peach/20 dark:to-dark-sage/20" />

                <div className="flex-1 flex items-center justify-center">
                    <img
                        src={register}
                        alt="Register"
                        className="w-full h-full object-contain"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Register;