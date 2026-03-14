import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getCart,
    removeFromCart,
    updateCartQuantity,
    IMAGE_BASE_URL,
} from "../services/api";
import "./Cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const userId =
        user?.id ||
        user?.user?.id ||
        user?.user_id ||
        user?.user?.user_id ||
        user?.data?.id ||
        user?.data?.user_id;

    const resolveImage = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith("http")) return imagePath;
        const filename = imagePath.split("/").pop();
        return `${IMAGE_BASE_URL}${filename}`;
    };

    const FALLBACK =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='120' viewBox='0 0 100 120'%3E%3Crect width='100' height='120' fill='%23f5f0ee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='9' fill='%23c4a882'%3ENo Image%3C/text%3E%3C/svg%3E";

    const fetchCart = async () => {
        if (!userId) {
            setError("Please login to view your cart.");
            setLoading(false);
            return;
        }
        try {
            const response = await getCart(userId);
            if (response?.data?.status === "success") {
                setCartItems(response.data.data || []);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Failed to load cart items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const handleRemove = async (cartId) => {
        try {
            const response = await removeFromCart(cartId);
            if (response?.data?.status === "success") {
                setCartItems((prev) =>
                    prev.filter((item) => item.cart_id !== cartId)
                );
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                alert(response?.data?.message || "Failed to remove item");
            }
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    const handleUpdateQuantity = async (cartId, action) => {
        try {
            const response = await updateCartQuantity(cartId, action);
            if (response?.data?.status === "success") {
                fetchCart();
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                alert(response?.data?.message || "Failed to update quantity");
            }
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price || 0) * parseInt(item.quantity || 0, 10),
        0
    );

    if (loading) return (
        <div className="cart-page">
            <div className="cart-loading">Curating your bag...</div>
        </div>
    );

    if (error) return (
        <div className="cart-page">
            <div className="cart-error">
                <p>{error}</p>
                <Link to="/login" className="cart-btn">Login Now</Link>
            </div>
        </div>
    );

    return (
        <div className="cart-page">
            <div className="cart-container">

                {/* Page Title */}
                <div className="cart-title-row">
                    <h1 className="cart-title">Your Bag</h1>
                    <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <div className="empty-icon">🛍️</div>
                        <h3>Your bag is empty</h3>
                        <p>Discover our curated collection of luxury pieces.</p>
                        <Link to="/shop" className="btn-shop-empty">Explore the Atelier</Link>
                    </div>
                ) : (
                    <div className="cart-layout">

                        {/* ─── Items List ─────────────────────── */}
                        <div className="cart-items-section">

                            {/* Column Headers */}
                            <div className="cart-col-headers">
                                <span className="ch-product">Product</span>
                                <span className="ch-price">Price</span>
                                <span className="ch-qty">Qty</span>
                                <span className="ch-total">Total</span>
                                <span className="ch-action"></span>
                            </div>

                            {/* Items */}
                            {cartItems.map((item) => {
                                const cartId = item.cart_id;
                                const imgSrc = resolveImage(item.image) || FALLBACK;
                                const itemTotal = (parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10)).toFixed(2);

                                return (
                                    <div key={cartId} className="cart-item-row">

                                        {/* Product cell */}
                                        <div className="ci-product">
                                            <div className="ci-img-wrap">
                                                <img
                                                    src={imgSrc}
                                                    alt={item.product_name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                                                />
                                            </div>
                                            <div className="ci-meta">
                                                <Link to={`/product/${item.product_id}`} className="ci-name">
                                                    {item.product_name}
                                                </Link>
                                                <span className="ci-sku">#{item.product_id?.toString().padStart(4, "0")}</span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="ci-price">${parseFloat(item.price).toFixed(2)}</div>

                                        {/* Quantity */}
                                        <div className="ci-qty">
                                            <div className="qty-box">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => handleUpdateQuantity(cartId, "decrease")}
                                                    disabled={item.quantity <= 1}
                                                >−</button>
                                                <span className="qty-num">{item.quantity}</span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => handleUpdateQuantity(cartId, "increase")}
                                                >+</button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="ci-total">${itemTotal}</div>

                                        {/* Remove */}
                                        <button
                                            className="ci-remove"
                                            onClick={() => handleRemove(cartId)}
                                            title="Remove item"
                                        >✕</button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ─── Order Summary ───────────────────── */}
                        <aside className="cart-summary-panel">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-lines">
                                <div className="summary-line">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Shipping</span>
                                    <span className="summary-free">
                                        {subtotal > 150 ? "Free" : "$15.00"}
                                    </span>
                                </div>
                                {subtotal <= 150 && (
                                    <p className="free-ship-note">
                                        Add ${(150 - subtotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-total-row">
                                <span>Total</span>
                                <span>${(subtotal + (subtotal > 150 ? 0 : 15)).toFixed(2)}</span>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>

                            <Link to="/shop" className="continue-link">← Continue Shopping</Link>
                        </aside>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;