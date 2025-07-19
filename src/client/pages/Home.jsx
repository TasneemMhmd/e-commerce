import React from "react";
import Hero from "../components/home/Hero";
import Offers from "../components/home/Offers";
import FeaturedProducts from '../components/home/FeaturedProducts';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';

const Home = () => {
    return (
        <>
            <Hero />
            <Offers />
            <FeaturedProducts />
            <Testimonials />
            <Contact />
        </>
    );
};

export default Home;
