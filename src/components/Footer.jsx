
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="main-footer">
            <div className="container footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/" className="navbar-logo">
                            <div className="logo-symbol">C</div>
                            <div className="logo-text">
                                <span className="brand-name">CLASSIC COUTURE</span>
                            </div>
                        </Link>
                        <p className="footer-about">
                            Curating a life of timeless elegance and intentional style. Our pieces are crafted with the heritage of high-fashion and the vision of a sustainable future.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-icon">Instagram</a>
                            <a href="#" className="social-icon">Pinterest</a>
                            <a href="#" className="social-icon">Vimeo</a>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-title">COLLECTIONS</h4>
                        <Link to="/shop">Autumn 24</Link>
                        <Link to="/shop">The Silk Road</Link>
                        <Link to="/shop">Core Essential</Link>
                        <Link to="/shop">Member Early Access</Link>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-title">ASSISTANCE</h4>
                        <Link to="/contact">Contact Our Atelier</Link>
                        <Link to="/faq">Shipping & Logistics</Link>
                        <Link to="/faq">Private Appointments</Link>
                        <Link to="/faq">Care Guide</Link>
                    </div>

                    <div className="footer-newsletter">
                        <h4 className="footer-title">THE NEWSLETTER</h4>
                        <p>Subscribe to receive invitation to our private viewings and seasonal editorials.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your Email Address" required />
                            <button type="submit">JOIN</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Classic Couture. Developed for Excellence.</p>
                    <div className="footer-bottom-links">
                        <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="back-to-top">BACK TO TOP ↑</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
