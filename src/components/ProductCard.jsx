
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../services/api';
import WishlistButton from './WishlistButton';
import './ProductCard.css';

// Local SVG fallback
const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='420' viewBox='0 0 400 420'%3E%3Crect width='400' height='420' fill='%23f5f0ee'/%3E%3Ctext x='50%25' y='48%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23c4a882'%3ENo Image%3C/text%3E%3Ctext x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%23d4b89a'%3E%F0%9F%91%97%3C/text%3E%3C/svg%3E`;

const ProductCard = ({ product }) => {
    const [imgError, setImgError] = useState(false);

    // Resolve image URL — DB stores "../uploads/filename.jpg"
    const resolveImage = () => {
        if (imgError || !product.image) return FALLBACK_IMAGE;
        if (product.image.startsWith('http')) return product.image;
        const filename = product.image.split('/').pop();
        return `${IMAGE_BASE_URL}${filename}`;
    };

    const productId = product.id || product.product_id;
    const productName = product.name || product.product_name || 'Product';
    const categoryName = product.category_name || product.categories?.[0] || 'New Arrival';
    const tag = product.tag || product.tags?.[0] || null;
    const price = parseFloat(product.price || 0).toFixed(2);

    return (
        <div className="product-card">
            {/* Tag badge */}
            {tag && <span className="card-tag">{tag}</span>}

            {/* ♥ Wishlist button — top-right corner */}
            <div className="card-wishlist-btn">
                <WishlistButton product={product} size="md" />
            </div>

            <Link to={`/product/${productId}`} className="card-image-wrapper">
                <img
                    src={resolveImage()}
                    alt={productName}
                    className="card-image"
                    onError={() => setImgError(true)}
                />
                <div className="card-overlay">
                    <span className="quick-view">QUICK VIEW</span>
                </div>
            </Link>

            <div className="card-info">
                <span className="card-category">{categoryName}</span>
                <Link to={`/product/${productId}`} className="card-name">
                    {productName}
                </Link>
                <span className="card-price">${price}</span>
            </div>
        </div>
    );
};

export default ProductCard;
