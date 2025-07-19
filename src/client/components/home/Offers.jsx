import { motion } from "framer-motion";
import { FaTruck, FaTag, FaBolt } from "react-icons/fa";

const Offers = () => {
    const offers = [
        {
            title: "Free Shipping",
            description: "On orders over $50",
            icon: FaTruck,
            bgColor: "bg-light-blush/20 dark:bg-dark-blush/20",
        },
        {
            title: "30% Off",
            description: "New customer discount",
            icon: FaTag,
            bgColor: "bg-light-sage/20 dark:bg-dark-sage/20",
        },
        {
            title: "Flash Sale",
            description: "Limited time only",
            icon: FaBolt,
            bgColor: "bg-light-peach/20 dark:bg-dark-peach/20",
        },
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

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
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
        <section id="Offers" className="py-20 bg-light-peach dark:bg-dark-peach">
            <div className="container mx-auto px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-light-charcoal dark:text-dark-charcoal mb-4">
                        Special Offers
                    </h2>
                    <p className="text-lg text-light-charcoal/70 dark:text-dark-charcoal/70 max-w-2xl mx-auto">
                        Don't miss out on these amazing deals and exclusive offers just for
                        you
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {offers.map((offer, index) => {
                        const IconComponent = offer.icon;
                        return (
                            <motion.div
                                key={index}
                                className={`${offer.bgColor} backdrop-blur-sm rounded-2xl p-8 text-center hover:scale-105 transition-transform cursor-pointer`}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                                }}
                            >
                                <div className="flex justify-center mb-4">
                                    <IconComponent className="text-4xl text-light-charcoal dark:text-dark-charcoal" />
                                </div>
                                <h3 className="text-2xl font-bold text-light-charcoal dark:text-dark-charcoal mb-2">
                                    {offer.title}
                                </h3>
                                <p className="text-light-charcoal/80 dark:text-dark-charcoal/80">
                                    {offer.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <motion.button
                        className="bg-light-charcoal dark:bg-dark-charcoal text-light-peach dark:text-dark-peach px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Shop All Deals
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default Offers;