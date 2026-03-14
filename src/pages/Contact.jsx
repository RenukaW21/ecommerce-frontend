
import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us. Our atelier will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>REACH OUT TO OUR ATELIER</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-container">
                <div className="contact-grid">
                    {/* Information Side */}
                    <div className="contact-info reveal">
                        <h2>Get In Touch</h2>
                        <p>
                            Whether you're inquiring about our latest collections, a custom order, or simply want to share your experience with Classic Couture, we are here to assist you with the highest level of care.
                        </p>

                        <div className="info-cards">
                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div className="info-text">
                                    <h4>Our Atelier</h4>
                                    <p>123 Elegance Lane, Fashion District<br />Paris, France 75001</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">📞</div>
                                <div className="info-text">
                                    <h4>Phone Inquiries</h4>
                                    <p>+33 (0) 1 45 67 89 00<br />Mon - Fri: 9am - 6pm CET</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">✉️</div>
                                <div className="info-text">
                                    <h4>Digital Correspondence</h4>
                                    <p>renukawarkade257@gmail.com<br />press@classiccouture.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="contact-form reveal">
                        <div className="contact-form-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea
                                        name="message"
                                        rows="6"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn">SEND MESSAGE</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="map-section">
                <div className="map-placeholder">
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🗺️</div>
                    <h3>LOCATE OUR BOUTIQUE</h3>
                    <p>Paris • Milan • London • New York</p>
                </div>
            </section>
        </div>
    );
};

export default Contact;
