import { useWishlistContext } from '../context/WishlistContext';
import './WishlistButton.css';

/**
 * WishlistButton — heart toggle button for any product card
 * Props: product (object with id/name/price/image)
 *        size: 'sm' | 'md' (default 'md')
 */
const WishlistButton = ({ product, size = 'md' }) => {
    const { isWishlisted, toggleWishlist } = useWishlistContext();
    const productId = product.id || product.product_id;
    const wishlisted = isWishlisted(productId);

    const handleClick = (e) => {
        e.preventDefault();   // don't navigate if inside a <Link>
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <button
            className={`wishlist-btn wishlist-btn--${size} ${wishlisted ? 'wishlisted' : ''}`}
            onClick={handleClick}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
            <svg
                viewBox="0 0 24 24"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
            </svg>
        </button>
    );
};

export default WishlistButton;
