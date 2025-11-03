"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import './nav.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav 
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="navbar-container">
                {/* Logo */}
                <Link href="/" className="navbar-logo">
                    <span className="logo-text">Dev</span>
                    <span className="logo-highlight">Link</span>
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link href="#features" className="nav-link">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="nav-link">
                        How It Works
                    </Link>
                    <Link href="#pricing" className="nav-link">
                        Pricing
                    </Link>
                    <Link href="#about" className="nav-link">
                        About
                    </Link>
                </div>

                {/* CTA Buttons */}
                <div className="navbar-actions">
                    <Link href="/auth/login">
                        <button className="nav-btn-login">
                            Sign In
                        </button>
                    </Link>
                    <Link href="/auth/login">
                        <button className="nav-btn-signup">
                            Get Started
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;