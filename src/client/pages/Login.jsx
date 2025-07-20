import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import light from "/src/assets/images/light.png";
import dark from "/src/assets/images/dark.png";
import login from "/src/assets/images/login.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure, setRememberMe } from "../../redux/authSlice";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (name === "rememberMe") {
            dispatch(setRememberMe(checked));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (message.text) {
            setMessage({ type: "", text: "" });
        }

        if (name === "email" && value) {
            if (!validateEmail(value)) {
                setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }

        if (name === "password" && value) {
            if (!validatePassword(value)) {
                setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters long" }));
            } else {
                setErrors((prev) => ({ ...prev, password: "" }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setMessage({ 
                type: "error", 
                text: "Please enter your email address first to reset your password." 
            });
            return;
        }

        if (!validateEmail(formData.email)) {
            setMessage({ 
                type: "error", 
                text: "Please enter a valid email address." 
            });
            return;
        }

        setIsResettingPassword(true);
        setMessage({ type: "", text: "" });

        try {
            await sendPasswordResetEmail(auth, formData.email);
            setMessage({
                type: "success",
                text: "Password reset email sent! Please check your inbox and follow the instructions."
            });
        } catch (error) {
            let errorMessage = "Failed to send password reset email.";
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email address.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many requests. Please try again later.";
                    break;
                default:
                    errorMessage = "Failed to send password reset email. Please try again.";
            }
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            dispatch(loginStart());
            dispatch(setRememberMe(formData.rememberMe)); 
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;
            dispatch(loginSuccess(user));

            setMessage({
                type: "success",
                text: "Welcome back! Redirecting..."
            });

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            let errorMessage = "Login failed. Please try again.";
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email address.";
                    break;
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address format.";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                default:
                    errorMessage = "Login failed. Please try again.";
            }

            dispatch(loginFailure(errorMessage));
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const MessageAlert = ({ message }) => (
        <AnimatePresence>
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex items-center p-4 rounded-xl mb-4 ${message.type === "success"
                            ? "bg-light-sage/20 dark:bg-light-sage/50 border border-light-sage/30 dark:border-dark-sage/50"
                            : "bg-light-blush/20 dark:bg-light-blush/50 border border-light-blush/30 dark:border-dark-blush/50"
                        }`}
                >
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: message.type === "success" ? 360 : 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`mr-3 ${message.type === "success"
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
                    <p className={`text-sm font-medium ${message.type === "success"
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
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex items-center justify-center p-8 lg:p-12"
            >
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div whileHover={{ scale: 1.05 }} className="relative">
                                <img src={light} className="block dark:hidden w-32" alt="Logo Light" />
                                <img src={dark} className="hidden dark:block w-32" alt="Logo Dark" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-bold text-light-charcoal dark:text-dark-charcoal mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-light-charcoal/80 dark:text-dark-charcoal/80">
                            Sign in to your account
                        </p>
                    </motion.div>

                    <MessageAlert message={message} />

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        onSubmit={handleSubmit}
                        noValidate
                        className="space-y-6"
                    >                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="relative"
                        >
                            <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${errors.email
                                        ? 'text-light-blush dark:text-dark-blush'
                                        : 'text-light-sage'
                                    }`} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    className={`w-full pl-12 pr-4 py-4 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${errors.email
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
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="relative"
                        >
                            <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${errors.password
                                        ? 'text-light-blush dark:text-dark-blush'
                                        : 'text-light-sage'
                                    }`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    autoComplete="current-password"
                                    className={`w-full pl-12 pr-12 py-4 bg-light-beige dark:bg-dark-sage rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-light-charcoal dark:text-dark-charcoal placeholder-light-charcoal/50 dark:placeholder-dark-charcoal/50 ${errors.password
                                            ? 'border-2 border-light-blush focus:ring-light-blush/50 dark:focus:ring-dark-blush/50'
                                            : 'border border-light-sage/30 dark:border-dark-peach/30 focus:ring-light-blush dark:focus:ring-dark-blush'
                                        }`}
                                    placeholder="Enter your password"
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="flex items-center justify-between"
                        >
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-light-blush dark:text-dark-blush bg-light-beige dark:bg-dark-sage border-light-sage dark:border-dark-peach rounded focus:ring-light-blush dark:focus:ring-dark-blush focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-light-charcoal dark:text-dark-charcoal">
                                    Remember me
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={isResettingPassword}
                                className="text-sm text-light-blush dark:text-light-blush hover:text-light-peach dark:hover:text-light-peach transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResettingPassword ? "Sending..." : "Forgot password?"}
                            </button>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
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
                                    Signing In...
                                </motion.div>
                            ) : (
                                "Sign In"
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-center mt-8"
                    >
                        <p className="text-light-charcoal/80 dark:text-dark-charcoal/80 text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-light-charcoal dark:text-light-blush hover:text-dark-peach dark:hover:text-light-peach font-medium transition-colors duration-200"
                            >
                                Sign Up
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
                        src={login}
                        alt="Login"
                        className="w-full h-full object-contain"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;