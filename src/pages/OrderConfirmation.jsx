import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

    /* ── If navigated here directly (no state), redirect home ── */
    useEffect(() => {
        if (!state?.order_id) {
            navigate("/", { replace: true });
        }
    }, [state, navigate]);

    if (!state?.order_id) return null;

    const {
        order_id,
        total_amount,
        shipping_cost,
        items_count,
        full_name,
        payment_method,
    } = state;

    const paymentLabel =
        payment_method === "cod" ? "Cash on Delivery" :
            payment_method === "upi" ? "UPI / Online Transfer" :
                payment_method === "card" ? "Credit / Debit Card" : payment_method;

    return (
        <div className="oc-page">
            <div className="oc-container">

                {/* ── Success Checkmark Animation ── */}
                <div className="oc-check-wrap">
                    <div className="oc-check-circle">
                        <svg className="oc-checkmark" viewBox="0 0 52 52" aria-hidden="true">
                            <circle className="oc-check-bg" cx="26" cy="26" r="25" fill="none" />
                            <path className="oc-check-tick" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                </div>

                {/* ── Confirmation Text ── */}
                <div className="oc-text">
                    <h1 className="oc-title">Order Confirmed!</h1>
                    <p className="oc-subtitle">
                        Thank you{full_name ? `, ${full_name.split(" ")[0]}` : ""}! <br />
                        Your order has been placed and is being prepared.
                    </p>
                </div>

                {/* ── Order Details Card ── */}
                <div className="oc-card">
                    <div className="oc-card-header">
                        <span className="oc-order-label">Order</span>
                        <span className="oc-order-id">#{String(order_id).padStart(6, "0")}</span>
                    </div>

                    <div className="oc-details">
                        <div className="oc-detail-row">
                            <span className="oc-dl">Items</span>
                            <span className="oc-dv">{items_count} {parseInt(items_count) === 1 ? "item" : "items"}</span>
                        </div>
                        <div className="oc-detail-row">
                            <span className="oc-dl">Subtotal</span>
                            <span className="oc-dv">
                                ${(parseFloat(total_amount) - parseFloat(shipping_cost || 0)).toFixed(2)}
                            </span>
                        </div>
                        <div className="oc-detail-row">
                            <span className="oc-dl">Shipping</span>
                            <span className="oc-dv">
                                {parseFloat(shipping_cost) === 0
                                    ? <span className="oc-free">Free</span>
                                    : `$${parseFloat(shipping_cost).toFixed(2)}`}
                            </span>
                        </div>
                        <div className="oc-divider" />
                        <div className="oc-detail-row oc-total-row">
                            <span className="oc-dl">Total Paid</span>
                            <span className="oc-dv oc-total-val">${parseFloat(total_amount).toFixed(2)}</span>
                        </div>
                        <div className="oc-detail-row">
                            <span className="oc-dl">Payment</span>
                            <span className="oc-dv">{paymentLabel}</span>
                        </div>
                        <div className="oc-detail-row">
                            <span className="oc-dl">Status</span>
                            <span className="oc-dv">
                                <span className="oc-status-badge">⏳ Pending</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── What's Next ── */}
                <div className="oc-next">
                    <h3 className="oc-next-title">What happens next?</h3>
                    <div className="oc-steps">
                        <div className="oc-step">
                            <div className="oc-step-num">1</div>
                            <div className="oc-step-info">
                                <strong>Order Processing</strong>
                                <span>We're reviewing and preparing your items</span>
                            </div>
                        </div>
                        <div className="oc-step-connector" />
                        <div className="oc-step">
                            <div className="oc-step-num">2</div>
                            <div className="oc-step-info">
                                <strong>Dispatched</strong>
                                <span>Your parcel will be shipped within 1–2 business days</span>
                            </div>
                        </div>
                        <div className="oc-step-connector" />
                        <div className="oc-step">
                            <div className="oc-step-num">3</div>
                            <div className="oc-step-info">
                                <strong>Delivered</strong>
                                <span>Expected delivery in 3–7 business days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="oc-actions">
                    <Link to="/shop" className="oc-btn-primary">
                        Continue Shopping
                    </Link>
                    <Link to="/" className="oc-btn-outline">
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OrderConfirmation;
