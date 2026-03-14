import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, placeOrder, IMAGE_BASE_URL } from "../services/api";
import "./Checkout.css";

/* ── Helper: extract user id from localStorage ── */
const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return (
        user?.id ||
        user?.user?.id ||
        user?.user_id ||
        user?.user?.user_id ||
        user?.data?.id ||
        user?.data?.user_id ||
        null
    );
};

/* ── Helper: resolve product image URL ── */
const resolveImage = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const filename = imagePath.split("/").pop();
    return `${IMAGE_BASE_URL}${filename}`;
};

const FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='96' viewBox='0 0 80 96'%3E%3Crect width='80' height='96' fill='%23f5f0ee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='8' fill='%23c4a882'%3ENo Image%3C/text%3E%3C/svg%3E";

/* ── Steps enum ── */
const STEP = { DETAILS: 1, REVIEW: 2, PLACING: 3 };

const INITIAL_FORM = {
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "India",
    notes: "",
    payment_method: "cod",
};

/* ─────────────────────────────────────────────────────────────────────────────
   CHECKOUT COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
const Checkout = () => {
    const navigate = useNavigate();
    const userId = getUserId();

    const [step, setStep] = useState(STEP.DETAILS);
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");

    /* ── Redirect if not logged in ── */
    useEffect(() => {
        if (!userId) {
            navigate("/login", { state: { from: "/checkout" } });
        }
    }, [userId, navigate]);

    /* ── Fetch cart ── */
    useEffect(() => {
        if (!userId) return;
        (async () => {
            try {
                const res = await getCart(userId);
                const data = res?.data?.data || [];
                if (data.length === 0) {
                    navigate("/cart");
                } else {
                    setCartItems(data);
                }
            } catch {
                navigate("/cart");
            } finally {
                setLoadingCart(false);
            }
        })();
    }, [userId, navigate]);

    /* ── Price calculations ── */
    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price || 0) * parseInt(item.quantity || 0, 10),
        0
    );
    const shippingCost = subtotal > 150 ? 0 : 15;
    const grandTotal = subtotal + shippingCost;

    /* ── Form change handler ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setApiError("");
    };

    /* ── Validation ── */
    const validate = () => {
        const newErrors = {};
        const phoneRegex = /^[0-9+\-\s]{7,15}$/;
        const zipRegex = /^[A-Za-z0-9\s\-]{3,10}$/;

        if (!form.full_name.trim())
            newErrors.full_name = "Full name is required";
        else if (form.full_name.trim().length < 2)
            newErrors.full_name = "Name must be at least 2 characters";

        if (!form.phone.trim())
            newErrors.phone = "Phone number is required";
        else if (!phoneRegex.test(form.phone.trim()))
            newErrors.phone = "Enter a valid phone number";

        if (!form.address.trim())
            newErrors.address = "Street address is required";

        if (!form.city.trim())
            newErrors.city = "City is required";

        if (!form.state.trim())
            newErrors.state = "State / Province is required";

        if (!form.zip_code.trim())
            newErrors.zip_code = "ZIP / Postal code is required";
        else if (!zipRegex.test(form.zip_code.trim()))
            newErrors.zip_code = "Enter a valid ZIP code";

        if (!form.country.trim())
            newErrors.country = "Country is required";

        return newErrors;
    };

    /* ── Proceed to review ── */
    const handleReview = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Scroll to first error
            const firstErrorKey = Object.keys(validationErrors)[0];
            document.getElementById(`co-${firstErrorKey}`)?.focus();
            return;
        }
        setStep(STEP.REVIEW);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ── Place order ── */
    const handlePlaceOrder = async () => {
        setSubmitting(true);
        setApiError("");
        setStep(STEP.PLACING);
        try {
            const payload = {
                user_id: userId,
                full_name: form.full_name.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                zip_code: form.zip_code.trim(),
                country: form.country.trim(),
                notes: form.notes.trim(),
                payment_method: form.payment_method,
                address_id: 0,
            };

            const res = await placeOrder(payload);

            if (res?.data?.status === "success") {
                window.dispatchEvent(new Event("cartUpdated"));
                navigate("/order-confirmation", {
                    state: {
                        order_id: res.data.order_id,
                        total_amount: res.data.total_amount ?? grandTotal,
                        shipping_cost: res.data.shipping_cost ?? shippingCost,
                        items_count: res.data.items_count ?? cartItems.length,
                        full_name: form.full_name,
                        payment_method: form.payment_method,
                    },
                });
            } else {
                throw new Error(res?.data?.message || "Failed to place order. Please try again.");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "An unexpected error occurred.";
            setApiError(msg);
            setStep(STEP.REVIEW);
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Loading skeleton ── */
    if (loadingCart) {
        return (
            <div className="co-page">
                <div className="co-loading">
                    <div className="co-spinner" />
                    <p>Preparing your checkout…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="co-page">
            <div className="co-wrapper">

                {/* ── Page Header ── */}
                <div className="co-header">
                    <h1 className="co-title">Checkout</h1>
                    <div className="co-breadcrumb">
                        <Link to="/cart">Cart</Link>
                        <span className="co-sep">›</span>
                        <span className={step === STEP.DETAILS ? "co-bc-active" : ""}>Details</span>
                        <span className="co-sep">›</span>
                        <span className={step >= STEP.REVIEW ? "co-bc-active" : ""}>Review</span>
                        <span className="co-sep">›</span>
                        <span>Confirmed</span>
                    </div>
                </div>

                {/* ── Step Progress Bar ── */}
                <div className="co-progress">
                    <div className={`co-prog-step ${step >= STEP.DETAILS ? "active" : ""}`}>
                        <div className="co-prog-dot">1</div>
                        <span>Your Details</span>
                    </div>
                    <div className={`co-prog-line ${step >= STEP.REVIEW ? "active" : ""}`} />
                    <div className={`co-prog-step ${step >= STEP.REVIEW ? "active" : ""}`}>
                        <div className="co-prog-dot">2</div>
                        <span>Review & Pay</span>
                    </div>
                    <div className={`co-prog-line ${step === STEP.PLACING ? "active" : ""}`} />
                    <div className={`co-prog-step ${step === STEP.PLACING ? "active" : ""}`}>
                        <div className="co-prog-dot">3</div>
                        <span>Confirmed</span>
                    </div>
                </div>

                {/* ── Main Content Layout ── */}
                <div className="co-layout">

                    {/* ══════════════════════ LEFT COLUMN ══════════════════════ */}
                    <div className="co-main">

                        {/* ── STEP 1: Shipping Form ── */}
                        {step === STEP.DETAILS && (
                            <form className="co-form" onSubmit={handleReview} noValidate>

                                {/* Contact */}
                                <section className="co-section">
                                    <h2 className="co-section-title">Contact Information</h2>
                                    <div className="co-fields">
                                        <div className={`co-field ${errors.full_name ? "has-error" : ""}`}>
                                            <label htmlFor="co-full_name">Full Name <span className="co-req">*</span></label>
                                            <input
                                                id="co-full_name"
                                                type="text"
                                                name="full_name"
                                                placeholder="Jane Doe"
                                                value={form.full_name}
                                                onChange={handleChange}
                                                autoComplete="name"
                                            />
                                            {errors.full_name && <span className="co-err-msg">{errors.full_name}</span>}
                                        </div>

                                        <div className={`co-field ${errors.phone ? "has-error" : ""}`}>
                                            <label htmlFor="co-phone">Phone Number <span className="co-req">*</span></label>
                                            <input
                                                id="co-phone"
                                                type="tel"
                                                name="phone"
                                                placeholder="+91 98765 43210"
                                                value={form.phone}
                                                onChange={handleChange}
                                                autoComplete="tel"
                                            />
                                            {errors.phone && <span className="co-err-msg">{errors.phone}</span>}
                                        </div>

                                        <div className="co-field co-field--full">
                                            <label htmlFor="co-email">Email Address <span className="co-opt">(optional)</span></label>
                                            <input
                                                id="co-email"
                                                type="email"
                                                name="email"
                                                placeholder="jane@example.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Shipping Address */}
                                <section className="co-section">
                                    <h2 className="co-section-title">Shipping Address</h2>
                                    <div className="co-fields">

                                        <div className={`co-field co-field--full ${errors.address ? "has-error" : ""}`}>
                                            <label htmlFor="co-address">Street Address <span className="co-req">*</span></label>
                                            <input
                                                id="co-address"
                                                type="text"
                                                name="address"
                                                placeholder="123, MG Road, Apartment 4B"
                                                value={form.address}
                                                onChange={handleChange}
                                                autoComplete="street-address"
                                            />
                                            {errors.address && <span className="co-err-msg">{errors.address}</span>}
                                        </div>

                                        <div className={`co-field ${errors.city ? "has-error" : ""}`}>
                                            <label htmlFor="co-city">City <span className="co-req">*</span></label>
                                            <input
                                                id="co-city"
                                                type="text"
                                                name="city"
                                                placeholder="Mumbai"
                                                value={form.city}
                                                onChange={handleChange}
                                                autoComplete="address-level2"
                                            />
                                            {errors.city && <span className="co-err-msg">{errors.city}</span>}
                                        </div>

                                        <div className={`co-field ${errors.state ? "has-error" : ""}`}>
                                            <label htmlFor="co-state">State / Province <span className="co-req">*</span></label>
                                            <input
                                                id="co-state"
                                                type="text"
                                                name="state"
                                                placeholder="Maharashtra"
                                                value={form.state}
                                                onChange={handleChange}
                                                autoComplete="address-level1"
                                            />
                                            {errors.state && <span className="co-err-msg">{errors.state}</span>}
                                        </div>

                                        <div className={`co-field ${errors.zip_code ? "has-error" : ""}`}>
                                            <label htmlFor="co-zip_code">ZIP / Postal Code <span className="co-req">*</span></label>
                                            <input
                                                id="co-zip_code"
                                                type="text"
                                                name="zip_code"
                                                placeholder="400001"
                                                value={form.zip_code}
                                                onChange={handleChange}
                                                autoComplete="postal-code"
                                            />
                                            {errors.zip_code && <span className="co-err-msg">{errors.zip_code}</span>}
                                        </div>

                                        <div className={`co-field ${errors.country ? "has-error" : ""}`}>
                                            <label htmlFor="co-country">Country <span className="co-req">*</span></label>
                                            <select
                                                id="co-country"
                                                name="country"
                                                value={form.country}
                                                onChange={handleChange}
                                                autoComplete="country"
                                            >
                                                <option value="India">India</option>
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="France">France</option>
                                                <option value="UAE">UAE</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.country && <span className="co-err-msg">{errors.country}</span>}
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Method */}
                                <section className="co-section">
                                    <h2 className="co-section-title">Payment Method</h2>
                                    <div className="co-payment-options">
                                        <label className={`co-payment-card ${form.payment_method === "cod" ? "selected" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={form.payment_method === "cod"}
                                                onChange={handleChange}
                                            />
                                            <div className="co-pm-icon">💵</div>
                                            <div className="co-pm-info">
                                                <strong>Cash on Delivery</strong>
                                                <span>Pay when your order arrives</span>
                                            </div>
                                            <div className={`co-pm-check ${form.payment_method === "cod" ? "show" : ""}`}>✓</div>
                                        </label>

                                        <label className={`co-payment-card ${form.payment_method === "upi" ? "selected" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="upi"
                                                checked={form.payment_method === "upi"}
                                                onChange={handleChange}
                                            />
                                            <div className="co-pm-icon">📱</div>
                                            <div className="co-pm-info">
                                                <strong>UPI / Online Transfer</strong>
                                                <span>Pay via UPI, NEFT or IMPS</span>
                                            </div>
                                            <div className={`co-pm-check ${form.payment_method === "upi" ? "show" : ""}`}>✓</div>
                                        </label>

                                        <label className={`co-payment-card ${form.payment_method === "card" ? "selected" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="card"
                                                checked={form.payment_method === "card"}
                                                onChange={handleChange}
                                            />
                                            <div className="co-pm-icon">💳</div>
                                            <div className="co-pm-info">
                                                <strong>Credit / Debit Card</strong>
                                                <span>Visa, Mastercard, RuPay</span>
                                            </div>
                                            <div className={`co-pm-check ${form.payment_method === "card" ? "show" : ""}`}>✓</div>
                                        </label>
                                    </div>
                                </section>

                                {/* Order Notes */}
                                <section className="co-section">
                                    <div className="co-field co-field--full">
                                        <label htmlFor="co-notes">Order Notes <span className="co-opt">(optional)</span></label>
                                        <textarea
                                            id="co-notes"
                                            name="notes"
                                            rows={3}
                                            placeholder="Special delivery instructions, gift note…"
                                            value={form.notes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </section>

                                <button type="submit" className="co-btn-primary">
                                    Review Your Order →
                                </button>
                            </form>
                        )}

                        {/* ── STEP 2: Review ── */}
                        {(step === STEP.REVIEW || step === STEP.PLACING) && (
                            <div className="co-review">

                                {/* Shipping Summary */}
                                <section className="co-section">
                                    <div className="co-review-header">
                                        <h2 className="co-section-title">Shipping Details</h2>
                                        <button
                                            className="co-edit-btn"
                                            onClick={() => { setStep(STEP.DETAILS); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="co-review-card">
                                        <div className="co-review-row">
                                            <span className="co-rv-label">Name</span>
                                            <span className="co-rv-val">{form.full_name}</span>
                                        </div>
                                        <div className="co-review-row">
                                            <span className="co-rv-label">Phone</span>
                                            <span className="co-rv-val">{form.phone}</span>
                                        </div>
                                        {form.email && (
                                            <div className="co-review-row">
                                                <span className="co-rv-label">Email</span>
                                                <span className="co-rv-val">{form.email}</span>
                                            </div>
                                        )}
                                        <div className="co-review-row">
                                            <span className="co-rv-label">Address</span>
                                            <span className="co-rv-val">
                                                {form.address}, {form.city}, {form.state} {form.zip_code}, {form.country}
                                            </span>
                                        </div>
                                        <div className="co-review-row">
                                            <span className="co-rv-label">Payment</span>
                                            <span className="co-rv-val co-pm-badge">
                                                {form.payment_method === "cod" && "💵 Cash on Delivery"}
                                                {form.payment_method === "upi" && "📱 UPI / Online Transfer"}
                                                {form.payment_method === "card" && "💳 Credit / Debit Card"}
                                            </span>
                                        </div>
                                        {form.notes && (
                                            <div className="co-review-row">
                                                <span className="co-rv-label">Notes</span>
                                                <span className="co-rv-val co-rv-notes">{form.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Cart Items in Review */}
                                <section className="co-section">
                                    <h2 className="co-section-title">Your Order ({cartItems.length} {cartItems.length === 1 ? "Item" : "Items"})</h2>
                                    <div className="co-order-items">
                                        {cartItems.map((item) => {
                                            const imgSrc = resolveImage(item.image) || FALLBACK;
                                            const lineTotal = (parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10)).toFixed(2);
                                            return (
                                                <div key={item.cart_id} className="co-order-item">
                                                    <div className="co-oi-img">
                                                        <img
                                                            src={imgSrc}
                                                            alt={item.product_name}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                                                        />
                                                        <span className="co-oi-qty">{item.quantity}</span>
                                                    </div>
                                                    <div className="co-oi-info">
                                                        <span className="co-oi-name">{item.product_name}</span>
                                                        <span className="co-oi-unit">${parseFloat(item.price).toFixed(2)} / unit</span>
                                                    </div>
                                                    <span className="co-oi-total">${lineTotal}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* API Error */}
                                {apiError && (
                                    <div className="co-api-error" role="alert">
                                        <span className="co-err-icon">⚠</span>
                                        <span>{apiError}</span>
                                    </div>
                                )}

                                <button
                                    className="co-btn-primary co-btn-place"
                                    onClick={handlePlaceOrder}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="co-btn-spinner">
                                            <span className="co-spinner-sm" /> Processing…
                                        </span>
                                    ) : (
                                        `Place Order • $${grandTotal.toFixed(2)}`
                                    )}
                                </button>

                                <button
                                    className="co-btn-back"
                                    onClick={() => setStep(STEP.DETAILS)}
                                    disabled={submitting}
                                >
                                    ← Back to Details
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ══════════════════════ RIGHT: ORDER SUMMARY ══════════════════════ */}
                    <aside className="co-sidebar">
                        <div className="co-summary-box">
                            <h3 className="co-summary-title">Order Summary</h3>

                            {/* Mini item list */}
                            <div className="co-mini-items">
                                {cartItems.map((item) => {
                                    const imgSrc = resolveImage(item.image) || FALLBACK;
                                    return (
                                        <div key={item.cart_id} className="co-mini-item">
                                            <div className="co-mini-img-wrap">
                                                <img
                                                    src={imgSrc}
                                                    alt={item.product_name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                                                />
                                                <span className="co-mini-badge">{item.quantity}</span>
                                            </div>
                                            <span className="co-mini-name">{item.product_name}</span>
                                            <span className="co-mini-price">
                                                ${(parseFloat(item.price) * parseInt(item.quantity, 10)).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="co-sum-divider" />

                            <div className="co-sum-lines">
                                <div className="co-sum-line">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="co-sum-line">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? "co-free" : ""}>
                                        {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                {shippingCost > 0 && (
                                    <p className="co-free-hint">
                                        Add ${(150 - subtotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                            </div>

                            <div className="co-sum-divider" />

                            <div className="co-sum-total">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>

                            <div className="co-trust-badges">
                                <div className="co-badge">🔒 Secure Checkout</div>
                                <div className="co-badge">🚚 Fast Delivery</div>
                                <div className="co-badge">↩ Easy Returns</div>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
