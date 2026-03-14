
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, addToCart, IMAGE_BASE_URL } from '../services/api';
import '../pages/ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(id);
                // Adjust based on your API response structure. 
                // E.g. response.data could be { status: 'success', data: { ...product } }
                const data = response.data;
                if (data.status === 'success' || data.id) {
                    setProduct(data.data || data); // Store the product object
                } else {
                    setError('Product not found or invalid response.');
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || (!user.id && !user.user?.id && !user.user_id && !user.user?.user_id && !user.data?.id && !user.data?.user_id)) {
            alert('Please login to add items to your cart.');
            navigate('/login');
            return;
        }

        const userId = user.id || user.user?.id || user.user_id || user.user?.user_id || user.data?.id || user.data?.user_id;
        const productId = product.id || product.product_id || id;

        setAddingToCart(true);
        try {
            const response = await addToCart({
                user_id: userId,
                product_id: productId,
                quantity: 1
            });

            if (response.data.status === 'success') {
                showToast('Product added to cart successfully!');
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                showToast(response.data.message || 'Failed to add to cart.');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            showToast('An error occurred. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <div className="loading">Loading product details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Product not found.</div>;

    return (
        <div className="product-details-container">
            {toastMessage && (
                <div className="custom-toast">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{toastMessage}</span>
                </div>
            )}

            <Link to="/" className="back-btn">&larr; Back to Products</Link>

            <div className="product-details-image">
                <img
                    src={(() => {
                        if (!product.image) return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f5f0ee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23c4a882'%3ENo Image Available%3C/text%3E%3C/svg%3E`;
                        if (product.image.startsWith('http')) return product.image;
                        // DB stores "../uploads/filename.jpg" — extract just the filename
                        const filename = product.image.split('/').pop();
                        return `${IMAGE_BASE_URL}${filename}`;
                    })()}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f5f0ee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23c4a882'%3EImage Not Found%3C/text%3E%3C/svg%3E`;
                    }}
                />
            </div>


            <div className="product-details-info">
                <h1>{product.name}</h1>

                {product.category_name && (
                    <span className="product-category">{product.category_name}</span>
                )}

                <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>

                <div className="product-description">
                    <p>{product.description}</p>
                </div>

                <button
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                >
                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
