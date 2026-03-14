import { Link } from 'react-router-dom';
import { useWishlistContext } from '../context/WishlistContext';
import { IMAGE_BASE_URL } from '../services/api';
import WishlistButton from '../components/WishlistButton';
import './Wishlist.css';

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='240' viewBox='0 0 200 240'%3E%3Crect width='200' height='240' fill='%23f5f0ee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23c4a882'%3ENo Image%3C/text%3E%3C/svg%3E`;

const resolveImage = (imagePath) => {
    if (!imagePath) return FALLBACK;
    if (imagePath.startsWith('http')) return imagePath;
    const filename = imagePath.split('/').pop();
    return `${IMAGE_BASE_URL}${filename}`;
};

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlistContext();

    return (
        <div className="wishlist-page">
            {/* Hero */}
            <header className="wishlist-hero">
                <div className="container">
                    <span className="aesthetic-script" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>
                        Saved for you
                    </span>
                    <h1>My Wishlist</h1>
                    <p>Your curated collection of favourite pieces.</p>
                </div>
            </header>

            <div className="wishlist-container container">

                {wishlist.length === 0 ? (
                    /* ── Empty State ── */
                    <div className="wishlist-empty">
                        <div className="empty-heart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
                            </svg>
                        </div>
                        <h2>Your wishlist is empty</h2>
                        <p>Browse our collections and save the pieces you love.</p>
                        <Link to="/shop" className="btn-explore">Explore The Atelier</Link>
                    </div>
                ) : (
                    <>
                        {/* ── Toolbar ── */}
                        <div className="wishlist-toolbar">
                            <span className="wishlist-count">
                                {wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'} Saved
                            </span>
                            <Link to="/shop" className="wishlist-continue">Continue Shopping →</Link>
                        </div>

                        {/* ── Grid ── */}
                        <div className="wishlist-grid">
                            {wishlist.map((item) => (
                                <div key={item.id} className="wl-card">
                                    {/* Image */}
                                    <Link to={`/product/${item.id}`} className="wl-img-wrap">
                                        <img
                                            src={resolveImage(item.image)}
                                            alt={item.name}
                                            className="wl-img"
                                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                                        />
                                        <div className="wl-overlay">
                                            <span className="wl-view-btn">QUICK VIEW</span>
                                        </div>
                                    </Link>

                                    {/* Heart remove button — top right */}
                                    <div className="wl-heart-wrap">
                                        <WishlistButton product={item} size="md" />
                                    </div>

                                    {/* Info */}
                                    <div className="wl-info">
                                        {item.category_name && (
                                            <span className="wl-category">{item.category_name}</span>
                                        )}
                                        <Link to={`/product/${item.id}`} className="wl-name">{item.name}</Link>
                                        <span className="wl-price">${parseFloat(item.price).toFixed(2)}</span>

                                        <div className="wl-actions">
                                            <Link to={`/product/${item.id}`} className="btn-wl-view">
                                                View Product
                                            </Link>
                                            <button
                                                className="btn-wl-remove"
                                                onClick={() => removeFromWishlist(item.id)}
                                                title="Remove from wishlist"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
