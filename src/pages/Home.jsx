
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || '';
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setSelectedCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (err) { console.error(err); }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const params = { search: searchTerm };
                if (selectedCategory) params.category_id = selectedCategory;
                const res = await getProducts(params);
                setProducts(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (err) { setError("Failed to connect to API"); }
            finally { setLoading(false); }
        };
        fetchItems();
    }, [searchTerm, selectedCategory]);

    return (
        <div className="home-page">
            {/* 1. HERO SECTION */}
            <section className="hero-section">
                <div className="hero-bg-overlay"></div>
                <div className="container hero-content">
                    <div className="hero-text-box">
                        <span className="hero-sub">WELCOME TO CLASSIC COUTURE</span>
                        <h1 className="hero-title">TIMELESS <br /> ELEGANCE FOR YOU</h1>
                        <p className="hero-desc">
                            Discover our curated collection of luxury clothing designed for the modern individual who values quality and style above all else.
                        </p>
                        <div className="hero-btns">
                            <button className="btn-primary">GET STARTED</button>
                            <button className="btn-white-text">LEARN MORE</button>
                        </div>
                    </div>
                </div>
                <div className="hero-scroll-indicator">
                    <div className="dot active"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </section>

            {/* 2. CREATIVE CONCEPTS SECTION - Dusty Blue */}
            <section className="concepts-section bg-dusty-blue">
                <div className="container reveal">
                    <div className="section-header center">
                        <span className="aesthetic-script">Creative & Unique</span>
                        <h2 className="section-title text-white">AUTUMN COLLECTION</h2>
                        <button className="btn-shop-now-outline">SHOP NOW</button>
                    </div>
                    <div className="concepts-grid">
                        <div className="concept-card">
                            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" alt="Casual" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=803'; }} />
                        </div>
                        <div className="concept-card">
                            <img src="https://i.pinimg.com/1200x/51/91/d3/5191d30c54a733a54121fc1b3c044577.jpg" alt="Minimalist" onError={(e) => { e.target.src = 'https://i.pinimg.com/1200x/51/91/d3/5191d30c54a733a54121fc1b3c044577.jpg'; }} />
                        </div>
                        <div className="concept-card">
                            <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2005" alt="Premium" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=805'; }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SEASONAL SALE SECTION - Warm Tan */}
            <section className="aesthetic-banner-section bg-warm-tan">
                <div className="container reveal flex-between">
                    <div className="banner-content">
                        <span className="aesthetic-script dark">Limited Time Offer</span>
                        <h2 className="section-title main-bold">Seasonal Sale <br /> UP TO -70%</h2>
                        <button className="btn-shop-now-dark">SHOP NOW</button>
                    </div>
                    <div className="banner-image">
                        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020" alt="Sale" />
                    </div>
                </div>
            </section>

            {/* 4. CASUAL STYLE SECTION - Soft Pink */}
            <section className="aesthetic-banner-section bg-soft-pink">
                <div className="container reveal flex-reverse">
                    <div className="banner-content">
                        <span className="aesthetic-script dark">Everyday Comfort</span>
                        <h2 className="section-title main-bold">Casual <br /> Daily Styles</h2>
                        <button className="btn-shop-now-dark">SHOP NOW</button>
                    </div>
                    <div className="banner-image">
                        <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073" alt="Casual" />
                    </div>
                </div>
            </section>

            {/* 5. WINTER JACKETS SECTION - Earth Brown */}
            <section className="aesthetic-banner-section bg-earth-brown text-white">
                <div className="container reveal flex-between">
                    <div className="banner-content">
                        <span className="aesthetic-script">Premium Essentials</span>
                        <h2 className="section-title main-bold">Winter <br /> Jackets & Coats</h2>
                        <button className="btn-shop-now-outline-white">SHOP NOW</button>
                    </div>
                    <div className="banner-image">
                        <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974" alt="Winter" />
                    </div>
                </div>
            </section>

            {/* 6. SHOPPING SECTION */}
            {/* <section className="shop-section">
                <div className="container">
                    <div className="shop-header fade-in">
                        <div className="shop-title-area">
                            <h2 className="section-title">OUR LATEST ARRIVALS</h2>
                            {searchTerm && <p className="search-result-info">Showing results for: "<strong>{searchTerm}</strong>"</p>}
                        </div>
                        <div className="shop-filters">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="styled-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id || c.category_id} value={c.id || c.category_id}>
                                        {c.name || c.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">Curating products for you...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <div className="product-grid reveal">
                            {products.length > 0 ? (
                                products.map(p => <ProductCard key={p.id || p.product_id} product={p} />)
                            ) : (
                                <div className="no-results">
                                    <p>No pieces found matching your criteria.</p>
                                    <button className="btn-outline" onClick={() => setSelectedCategory('')}>Clear Filters</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section> */}

            {/* 7. INSTAGRAM FEED SECTION */}
            <section className="instagram-section">
                <div className="container reveal">
                    <div className="section-header center">
                        <span className="aesthetic-script dark">The Curated Gallery</span>
                        <h2 className="section-title">OUR ATELIER ON INSTAGRAM</h2>
                        <p className="hero-desc" style={{ color: 'var(--text-muted)' }}>Follow our journey and tag us @CLASSICCOUTURE to be featured in our seasonal editorials.</p>
                    </div>
                    <div className="insta-grid">
                        <div className="insta-box"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020" alt="Insta 1" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=807'; }} /></div>
                        <div className="insta-box"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" alt="Insta 2" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=808'; }} /></div>
                        <div className="insta-box"><img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073" alt="Insta 3" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=809'; }} /></div>
                        <div className="insta-box"><img src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1972" alt="Insta 4" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=810'; }} /></div>
                        <div className="insta-box"><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976" alt="Insta 5" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=811'; }} /></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
