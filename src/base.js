import React from 'react'
import Informations from './views/information/informations.js'
import WorkingPlaces from './views/working.places/working_places';
import JoinUs from "./views/join.us/join_us.js"
import Navbar from './components/navbar/navbar';
import Home from './views/home/home'
import SupportPackages from './views/support.packages/support_package';
import Footer from "./views/footer/footer"
import { motion } from 'framer-motion';
import Slogan from './views/slogan/slogan.js';

export default function Base() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration:0.5}}
        >
            <Navbar />
            <Home />
            <Informations dataAos="fade-right"/>
            <WorkingPlaces />
            <SupportPackages dataAos="fade-top"/>
            <Slogan/>
            <JoinUs dataAos="zoom-in-up"/>
            <Footer />
        </motion.div>
    )
}
