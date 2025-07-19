import { motion } from 'framer-motion';
import hero from '/src/assets/images/hero.png';

const Hero = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, x: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.4
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <motion.section
            className="min-h-screen bg-gradient-to-br from-light-peach via-light-beige to-light-sage dark:from-dark-peach dark:via-dark-beige dark:to-dark-sage relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 bg-light-blush dark:bg-dark-blush rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-light-sage dark:bg-dark-sage rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 lg:px-8 h-full min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

                    {/* Left Content */}
                    <motion.div
                        className="space-y-8 lg:pr-8"
                        variants={textVariants}
                    >
                        <motion.div variants={textVariants}>
                            <motion.span
                                className="inline-block px-4 py-2 bg-light-blush/20 dark:bg-dark-blush/20 text-light-charcoal dark:text-dark-charcoal rounded-full text-sm font-medium tracking-wide"
                                whileHover={{ scale: 1.05 }}
                            >
                                ✨ Premium Collection 2025
                            </motion.span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl lg:text-7xl font-bold text-light-charcoal dark:text-dark-charcoal leading-tight"
                            variants={textVariants}
                        >
                            Welcome to{' '}
                            <motion.span
                                className="bg-gradient-to-r from-[#c2848e] via-[#4a5759] to-[#7a9c7b] dark:from-[#edafb8] dark:via-[#f7e1d7] dark:to-[#b0c4b1] bg-clip-text text-transparent"
                                style={{
                                    backgroundSize: '200% 200%'
                                }}
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                Our Store
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-lg lg:text-xl text-light-charcoal/80 dark:text-dark-charcoal/80 leading-relaxed max-w-lg"
                            variants={textVariants}
                        >
                            Discover extraordinary products crafted with passion and precision.
                            Experience quality that transforms your everyday moments into something special.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            variants={buttonVariants}
                        >
                            <motion.button
                                className="bg-light-charcoal dark:bg-dark-charcoal text-light-peach dark:text-dark-peach px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Shop Collection
                            </motion.button>

                            <motion.button
                                className="border-2 border-light-charcoal dark:border-dark-charcoal text-light-charcoal dark:text-dark-charcoal px-8 py-4 rounded-full font-semibold text-lg hover:bg-light-charcoal hover:text-light-peach dark:hover:bg-dark-charcoal dark:hover:text-dark-peach transition-colors"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Learn More
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-light-charcoal/20 dark:border-dark-charcoal/20"
                            variants={textVariants}
                        >
                            {[
                                { number: "10K+", label: "Happy Customers" },
                                { number: "500+", label: "Premium Products" },
                                { number: "5★", label: "Customer Rating" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-2xl lg:text-3xl font-bold text-light-charcoal dark:text-dark-charcoal">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-light-charcoal/70 dark:text-dark-charcoal/70">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        className="relative"
                        variants={imageVariants}
                    >
                        <div
                            className="relative z-10"
                        >
                            <img
                                src={hero}
                                alt="Hero"
                                className="w-full h-auto max-w-lg mx-auto"
                            />
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            className="absolute -top-4 -right-4 w-20 h-20 bg-light-blush dark:bg-dark-blush rounded-full opacity-80"
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 360]
                            }}
                            transition={{
                                y: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                rotate: {
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                        />

                        <motion.div
                            className="absolute -bottom-4 -left-4 w-16 h-16 bg-light-sage dark:bg-dark-sage rounded-full opacity-80"
                            animate={{
                                y: [0, 10, 0],
                                rotate: [360, 0]
                            }}
                            transition={{
                                y: {
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                rotate: {
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="w-6 h-10 border-2 border-light-charcoal/30 dark:border-dark-charcoal/30 rounded-full flex justify-center"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1 h-3 bg-light-charcoal/50 dark:bg-dark-charcoal/50 rounded-full mt-2"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
};

export default Hero;