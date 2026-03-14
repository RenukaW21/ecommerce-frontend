
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../services/api';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cc_wishlist') || '[]').length; } catch { return 0; }
    });

    // Live search fetch logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length > 1) {
                try {
                    // Parallel fetch products and categories
                    const [prodRes, catRes] = await Promise.all([
                        api.get('getProducts.php', { params: { search: searchQuery } }),
                        api.get('getCategory.php')
                    ]);

                    const products = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.data || []);
                    const allCategories = Array.isArray(catRes.data) ? catRes.data : (catRes.data.data || []);

                    // Filter categories locally
                    const filteredCats = allCategories.filter(cat =>
                        (cat.name || cat.category_name || '').toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    setSuggestions({
                        products: products.slice(0, 4),
                        categories: filteredCats.slice(0, 3)
                    });
                    setShowSuggestions(true);
                } catch (err) {
                    console.error("Suggestion fetch failed", err);
                }
            } else {
                setSuggestions({ products: [], categories: [] });
                setShowSuggestions(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateCartCount = async () => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser || (!currentUser.id && !currentUser.user?.id && !currentUser.user_id && !currentUser.user?.user_id && !currentUser.data?.id && !currentUser.data?.user_id)) {
            setCartCount(0);
            return;
        }

        try {
            const userId = currentUser.id || currentUser.user?.id || currentUser.user_id || currentUser.user?.user_id || currentUser.data?.id || currentUser.data?.user_id;
            const response = await api.get(`getCart.php?user_id=${userId}`);
            if (response.data.status === 'success') {
                const items = response.data.data || [];
                const count = items.reduce((acc, item) => acc + parseInt(item.quantity, 10), 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        } catch (err) {
            console.error("Cart fetch error:", err);
        }
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    // Sync wishlist count from localStorage on every wishlistUpdated event
    useEffect(() => {
        const syncWishlist = () => {
            try { setWishlistCount(JSON.parse(localStorage.getItem('cc_wishlist') || '[]').length); } catch { setWishlistCount(0); }
        };
        window.addEventListener('wishlistUpdated', syncWishlist);
        return () => window.removeEventListener('wishlistUpdated', syncWishlist);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (searchQuery.trim()) {
            navigate(`/shop?search=${searchQuery}`);
        } else {
            navigate('/shop');
        }
    };

    const handleSuggestionClick = (productId) => {
        setShowSuggestions(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="navbar-header">
            <div className="navbar-top-bar">
                Free shipping on all premium orders over $150
            </div>
            <div className="navbar-main">
                <div className="container navbar-container">
                    {/* Left: Mobile Menu & Logo */}
                    <div className="navbar-left">
                        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>

                        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
                            <div className="logo-symbol">C</div>
                            <div className="logo-text">
                                <span className="brand-name">CLASSIC COUTURE</span>
                            </div>
                        </Link>
                    </div>

                    {/* Middle: Navigation Links */}
                    <nav className={`navbar-links ${isMenuOpen ? 'is-open' : ''}`}>
                        <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>HOME</Link>
                        <Link to="/categories" className="nav-item" onClick={() => setIsMenuOpen(false)}>COLLECTIONS</Link>
                        <Link to="/shop" className="nav-item" onClick={() => setIsMenuOpen(false)}>SHOP</Link>
                        <Link to="/contact" className="nav-item" onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
                    </nav>

                    {/* Right: Utilities (Search, Profile, Wishlist, Cart) */}
                    <div className="navbar-utilities">
                        {/* Search Bar with Live Suggestions */}
                        <div className="search-wrapper" ref={searchRef}>
                            <form className="navbar-search" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Search pieces..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                                />
                                <button type="submit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            </form>

                            {/* Suggestions Dropdown (omitted for brevity, assume unchanged logic) */}
                            {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
                                <div className="search-suggestions">
                                    {/* Categories Section */}
                                    {suggestions.categories.length > 0 && (
                                        <div className="suggestion-section">
                                            <div className="suggestion-label">Collections</div>
                                            {suggestions.categories.map((cat) => (
                                                <div
                                                    key={`cat-${cat.id || cat.category_id}`}
                                                    className="category-suggestion"
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        setSearchQuery('');
                                                        navigate(`/category/${cat.id || cat.category_id}`);
                                                    }}
                                                >
                                                    <span className="cat-icon">📁</span>
                                                    {cat.name || cat.category_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Products Section */}
                                    {suggestions.products.length > 0 && (
                                        <div className="suggestion-section">
                                            <div className="suggestion-label">Products</div>
                                            {suggestions.products.map((product) => (
                                                <div
                                                    key={product.id || product.product_id}
                                                    className="suggestion-item"
                                                    onClick={() => handleSuggestionClick(product.id || product.product_id)}
                                                >
                                                    <img src={`${IMAGE_BASE_URL}${product.image}`} alt="" className="suggestion-img" />
                                                    <div className="suggestion-info">
                                                        <div className="suggestion-name">{product.name}</div>
                                                        <div className="suggestion-price">${parseFloat(product.price).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button className="view-all-results" onClick={handleSearch}>
                                        View all for "{searchQuery}"
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profile Section */}
                        <ProfileDropdown user={user} onLogout={handleLogout} />

                        {/* Wishlist Section */}
                        <Link to="/wishlist" className="utility-item wishlist-link" style={{ position: 'relative' }}>
                            <div className="utility-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"></path>
                                </svg>
                                {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
                            </div>
                            <span className="utility-label">Wishlist</span>
                        </Link>

                        {/* Cart/Bag Section */}
                        <Link to="/cart" className="utility-item cart-link" style={{ position: 'relative' }}>
                            <div className="utility-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 01-8 0"></path>
                                </svg>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </div>
                            <span className="utility-label">Bag</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
