
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters & Sorting state
    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'latest';

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (err) {
                console.error("Failed to load categories.");
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const fetchShopProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    search: currentSearch,
                    category_id: currentCategory,
                    sort: currentSort
                };
                const res = await getProducts(params);
                setProducts(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (err) {
                setError("Failed to fetch atelier pieces.");
            } finally {
                setLoading(false);
            }
        };

        fetchShopProducts();
    }, [currentCategory, currentSearch, currentSort]);

    const handleCategoryChange = (id) => {
        const newParams = new URLSearchParams(searchParams);
        if (id) {
            newParams.set('category', id);
        } else {
            newParams.delete('category');
        }
        setSearchParams(newParams);
    };

    const handleSortChange = (sortType) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', sortType);
        setSearchParams(newParams);
    };

    return (
        <div className="shop-page">
            <header className="shop-hero">
                <div className="container">
                    <span className="aesthetic-script" style={{ color: 'var(--primary-color)', fontSize: '24px' }}>Curated for you</span>
                    <h1>The Atelier Shop</h1>
                    <p>Exclusive luxury pieces for the modern wardrobe.</p>
                </div>
            </header>

            <div className="shop-container">
                {/* Sidebar Filters */}
                <aside className="shop-sidebar">
                    <div className="filter-section">
                        <span className="filter-title">Collections</span>
                        <div className="filter-list">
                            <div
                                className={`filter-item ${!currentCategory ? 'active' : ''}`}
                                onClick={() => handleCategoryChange('')}
                            >
                                All Collections
                            </div>
                            {categories.map(cat => (
                                <div
                                    key={cat.id || cat.category_id}
                                    className={`filter-item ${String(currentCategory) === String(cat.id || cat.category_id) ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(cat.id || cat.category_id)}
                                >
                                    {cat.name || cat.category_name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <span className="filter-title">Price Range</span>
                        <div className="filter-list">
                            <div className="filter-item">Under $200</div>
                            <div className="filter-item">$200 - $500</div>
                            <div className="filter-item">$500 - $1000</div>
                            <div className="filter-item">$1000+</div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="shop-content">
                    <div className="shop-toolbar">
                        <div className="results-count">
                            {currentSearch ? (
                                <span>Results for "<strong>{currentSearch}</strong>" — </span>
                            ) : null}
                            Showing {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
                        </div>
                        <div className="shop-sorting">
                            <select
                                value={currentSort}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="latest">SORT BY: LATEST</option>
                                <option value="price_asc">PRICE: LOW TO HIGH</option>
                                <option value="price_desc">PRICE: HIGH TO LOW</option>
                                <option value="trending">TRENDING NOW</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">Curating products...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <div className="product-grid">
                            {products.length > 0 ? (
                                products.map(p => <ProductCard key={p.id || p.product_id} product={p} />)
                            ) : (
                                <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                                    <h3>No pieces found</h3>
                                    <p>We couldn't find any items matching your criteria.</p>
                                    <button className="btn-outline" onClick={() => handleCategoryChange('')} style={{ marginTop: '20px' }}>
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
