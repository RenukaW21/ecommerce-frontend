
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getProducts, getCategories, IMAGE_BASE_URL } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Categories.css'; // Reuse some styles or add new ones

const CategoryProducts = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // Fetch all categories and find the current one
                const catRes = await getCategories();
                // const cats = Array.isArray(catRes.data) ? catRes.data : (catRes.data.data || []);
                const cats = catRes.data.data || [];
                const currentCat = cats.find(c => String(c.id || c.category_id) === String(id));
                setCategory(currentCat);

                // Fetch products for this category
                const prodRes = await getProducts({ category_id: id });
                // setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.data || []));
                setProducts(prodRes.data.data || []);
            } catch (err) {
                setError("Failed to load collection.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [id]);

    if (loading) return <div className="loading-state">Curating the collection...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="category-products-page">
            <header className="category-header-banner">
                <div className="container">
                    <Link to="/categories" className="back-link">← ALL COLLECTIONS</Link>
                    {/* <h1 className="category-title">{category?.name || "Collection"}</h1> */}

                    <h1 className="category-title">
  {category?.category_name || "Collection"}
</h1>
                    <p className="category-subtitle">
                        {products.length} {products.length === 1 ? 'Piece' : 'Pieces'} Curated
                    </p>
                </div>
            </header>

            <section className="shop-section">
                <div className="container">
                    {products.length > 0 ? (
                        <div className="product-grid reveal">
                            {products.map(p => <ProductCard key={p.id || p.product_id} product={p} />)}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No pieces found in this collection currently.</p>
                            <Link to="/categories" className="btn-outline">Return to Collections</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CategoryProducts;
