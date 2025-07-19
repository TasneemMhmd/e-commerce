import { motion } from "framer-motion";
import { useState } from "react";
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Message sent successfully!");
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 2000);
    };

    const contactInfo = [
        {
            icon: FaMapMarkerAlt,
            title: "Visit Us",
            details: ["123 Business Street", "City, State 12345"],
        },
        {
            icon: FaPhone,
            title: "Call Us",
            details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM"],
        },
        {
            icon: FaEnvelope,
            title: "Email Us",
            details: ["hello@store.com", "support@store.com"],
        },
    ];

    const socialMedia = [
        { icon: FaFacebookF, label: "Facebook" },
        { icon: FaInstagram, label: "Instagram" },
        { icon: FaTwitter, label: "Twitter" },
        { icon: FaLinkedinIn, label: "LinkedIn" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
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
                    <h2 className="text-4xl lg:text-5xl font-bold text-light-charcoal dark:text-dark-charcoal mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-light-charcoal/70 dark:text-dark-charcoal/70 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and
                        we'll respond as soon as possible.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-bold text-light-charcoal dark:text-dark-charcoal mb-6">
                                Contact Information
                            </h3>
                        </motion.div>

                        {contactInfo.map((info, index) => {
                            const IconComponent = info.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="flex items-start space-x-4 p-6 bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-xl"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-center w-12 h-12">
                                        <IconComponent className="text-2xl text-light-charcoal dark:text-dark-charcoal" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg text-light-charcoal dark:text-dark-charcoal mb-2">
                                            {info.title}
                                        </h4>
                                        {info.details.map((detail, idx) => (
                                            <p
                                                key={idx}
                                                className="text-light-charcoal/80 dark:text-dark-charcoal/80"
                                            >
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Social Media */}
                        <motion.div className="pt-8" variants={itemVariants}>
                            <h4 className="font-semibold text-lg text-light-charcoal dark:text-dark-charcoal mb-4">
                                Follow Us
                            </h4>
                            <div className="flex space-x-4">
                                {socialMedia.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <motion.button
                                            key={index}
                                            className="w-12 h-12 bg-light-charcoal dark:bg-dark-charcoal rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title={social.label}
                                        >
                                            <IconComponent className="text-lg text-light-peach dark:text-dark-peach" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white/40 dark:bg-black/30 backdrop-blur-sm rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-light-charcoal dark:text-dark-charcoal mb-6">
                                Send us a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <motion.div
                                        whileFocus={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-light-charcoal/20 dark:border-dark-charcoal/20 rounded-xl focus:ring-2 focus:ring-light-blush dark:focus:ring-dark-blush focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </motion.div>

                                    <motion.div
                                        whileFocus={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-light-charcoal/20 dark:border-dark-charcoal/20 rounded-xl focus:ring-2 focus:ring-light-blush dark:focus:ring-dark-blush focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-light-charcoal/20 dark:border-dark-charcoal/20 rounded-xl focus:ring-2 focus:ring-light-blush dark:focus:ring-dark-blush focus:border-transparent outline-none transition-all"
                                        placeholder="How can we help you?"
                                    />
                                </motion.div>

                                <motion.div
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-light-charcoal dark:text-dark-charcoal mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-light-charcoal/20 dark:border-dark-charcoal/20 rounded-xl focus:ring-2 focus:ring-light-blush dark:focus:ring-dark-blush focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${isSubmitting
                                            ? "bg-light-charcoal/50 dark:bg-dark-charcoal/50 cursor-not-allowed"
                                            : "bg-light-charcoal dark:bg-dark-charcoal hover:shadow-lg"
                                        } text-light-peach dark:text-dark-peach`}
                                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-light-peach/30 border-t-light-peach rounded-full animate-spin mr-2"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        "Send Message"
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
