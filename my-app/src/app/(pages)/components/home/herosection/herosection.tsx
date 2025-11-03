"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import "./herosection.css";
import Navbar from "../navbar/nav";

const HeroSection = () => {
    return (
        <div className="landing-page">
            <Navbar />
            
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-gradient"></div>
                <div className="hero-container">
                    <motion.div 
                        className="hero-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="hero-badge">
                            <span className="badge-dot"></span>
                            Trusted by 10,000+ developers
                        </span>
                        <h1 className="hero-title">
                            One Link For
                            <span className="gradient-text"> Everything </span>
                            You Create
                        </h1>
                        <p className="hero-description">
                            Share your projects, social links, and portfolio with a single, 
                            beautiful link. Built for developers, creators, and professionals 
                            who want to make an impact.
                        </p>
                        <div className="hero-cta">
                            <Link href="/auth/login">
                                <button className="btn-primary">
                                    Get Started Free
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </Link>
                            <Link href="#features">
                                <button className="btn-secondary">
                                    See How It Works
                                </button>
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Active Users</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">500K+</span>
                                <span className="stat-label">Links Shared</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-number">99.9%</span>
                                <span className="stat-label">Uptime</span>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="demo-card">
                            <div className="demo-card-header">
                                <div className="demo-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                            <div className="demo-card-body">
                                <div className="demo-profile">
                                    <div className="demo-avatar"></div>
                                    <h3>@yourname</h3>
                                    <p>Full Stack Developer</p>
                                </div>
                                <div className="demo-links">
                                    <div className="demo-link">
                                        <span className="link-icon">🌐</span>
                                        <span>Portfolio Website</span>
                                    </div>
                                    <div className="demo-link">
                                        <span className="link-icon">💼</span>
                                        <span>LinkedIn Profile</span>
                                    </div>
                                    <div className="demo-link">
                                        <span className="link-icon">🐙</span>
                                        <span>GitHub Projects</span>
                                    </div>
                                    <div className="demo-link">
                                        <span className="link-icon">✉️</span>
                                        <span>Contact Me</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="features-container">
                    <div className="section-header">
                        <span className="section-badge">Features</span>
                        <h2 className="section-title">Everything You Need</h2>
                        <p className="section-description">
                            Powerful features to help you share your work and grow your audience
                        </p>
                    </div>
                    
                    <div className="features-grid">
                        <motion.div 
                            className="feature-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="feature-icon purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Optimized for speed with instant page loads and smooth interactions</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="feature-icon blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <h3>Custom Themes</h3>
                            <p>Personalize your page with beautiful themes and custom styling</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="feature-icon green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Analytics Dashboard</h3>
                            <p>Track clicks, views, and engagement with detailed analytics</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="feature-icon orange">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>QR Code Generator</h3>
                            <p>Instantly generate QR codes for your profile to share offline</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="feature-icon pink">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Unlimited Links</h3>
                            <p>Add as many links as you want with no restrictions</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="feature-icon cyan">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3>Custom Domain</h3>
                            <p>Use your own domain name for a professional touch</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="how-it-works-container">
                    <div className="section-header">
                        <span className="section-badge">Simple Process</span>
                        <h2 className="section-title">Get Started in Minutes</h2>
                        <p className="section-description">
                            Three simple steps to create your professional link page
                        </p>
                    </div>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Create Your Account</h3>
                                <p>Sign up in seconds and claim your unique username</p>
                            </div>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>Add Your Links</h3>
                                <p>Add all your important links and customize your profile</p>
                            </div>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Share & Grow</h3>
                                <p>Share your DevLink and watch your audience grow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-gradient"></div>
                <div className="cta-container">
                    <motion.div 
                        className="cta-content"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Ready to Get Started?</h2>
                        <p>Join thousands of developers and creators who trust DevLink</p>
                        <div className="cta-buttons">
                            <Link href="/auth/login">
                                <button className="btn-primary large">
                                    Create Your DevLink
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </Link>
                        </div>
                        <p className="cta-note">No credit card required • Free forever</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>DevLink</h3>
                            <p>One link for everything you create</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <Link href="#features">Features</Link>
                                <Link href="#">Pricing</Link>
                                <Link href="#">Templates</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <Link href="#">About</Link>
                                <Link href="#">Blog</Link>
                                <Link href="#">Contact</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Resources</h4>
                                <Link href="#">Documentation</Link>
                                <Link href="#">Help Center</Link>
                                <Link href="#">API</Link>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 DevLink. All rights reserved.</p>
                        <div className="footer-legal">
                            <Link href="#">Privacy Policy</Link>
                            <Link href="#">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HeroSection;