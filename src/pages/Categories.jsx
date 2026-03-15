
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Map of search terms to curated Unsplash images for a premium look
    const categoryImages = {
        'Winter': 'https://images.unsplash.com/photo-1544606116-574af25a8d3c?q=80&w=2070',
        'Summer': 'https://images.unsplash.com/photo-1523381235199-2f19bf3abbd6?q=80&w=2070',
        'Casual': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070',
        'Formal': 'https://images.unsplash.com/photo-1594932224011-041d83b1d9c5?q=80&w=2070',
        'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070',
        'Default': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070'
    };

    const getCategoryImage = (name) => {
        const found = Object.keys(categoryImages).find(key => name.toLowerCase().includes(key.toLowerCase()));
        return categoryImages[found || 'Default'];
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                // const data = Array.isArray(res.data) ? res.data : (res.data.data || []);

                const data = res.data.data || [];
                setCategories(data);
            } catch (err) {
                setError("Failed to curate categories.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (id) => {
        navigate(`/category/${id}`);
    };

    return (
        <div className="categories-page">
            <header className="categories-hero">
                <div className="container">
                    <span className="aesthetic-script" style={{ color: 'var(--primary-color)', fontSize: '24px' }}>Curated Selections</span>
                    <h1>The Collections</h1>
                    <p>Discover our meticulously designed series for every season and occasion.</p>
                </div>
            </header>

            <div className="container">
                {loading ? (
                    <div className="loading-state">Identifying collections...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((cat, index) => (
                            <div
                                key={cat.id || cat.category_id}
                                className="category-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handleCategoryClick(cat.id || cat.category_id)}
                            >
                                <img
                                    src={cat.image || getCategoryImage(cat.name || cat.category_name)}
                                    alt={cat.name || cat.category_name}
                                    className="category-image"
                                />
                                <div className="category-overlay">
                                    <div className="category-info">
                                        <h2 className="category-name">{cat.name || cat.category_name}</h2>
                                        <span className="category-explore">Explore Collection</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
