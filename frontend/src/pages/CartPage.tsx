import { useEffect, useState } from "react";
import { useCartStore } from "../store/UseCart.store";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
    const { cart, loading, removeFromCart, addToCart, fetchCart } = useCartStore();
    const navigate = useNavigate();
    useEffect(() => {
        fetchCart();
    }, []);
    const handleQuantityChange = (productId: number, currentQty: number, newQtyStr: string) => {
        const newQty = parseInt(newQtyStr);
        if (isNaN(newQty) || newQty < 1) return; 

        const diff = newQty - currentQty;
        if (diff > 0) {
            addToCart(productId, diff); 
        } else if (diff < 0) {
            removeFromCart(productId, Math.abs(diff)); 
        }
    };

    const calculateTotal = () => {
        if (!cart?.cartItems) return 0;
        return cart.cartItems.reduce((total, item) => {
            return total + (Number(item.product?.price || 0) * item.quantity);
        }, 0);
    };

    const cartTotal = calculateTotal();

    if (loading && !cart) return <div className="text-center mt-5">טוען...</div>;

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h2>העגלה ריקה 🛒</h2>
                <Link to="/" className="btn btn-primary mt-3">חזור לחנות</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">העגלה שלי</h2>
            <div className="row g-4">
                <div className="col-lg-8">
                    {cart.cartItems.map((item) => (
                        <div key={item.cartItemId} className="card mb-3 shadow-sm border-0">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center" style={{ width: '40%' }}>
                                        <img
                                            src={item.product?.imageUrl ? String(item.product.imageUrl) : 'https://via.placeholder.com/60'}
                                            alt={item.product?.name}
                                            className="rounded me-3"
                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                        />
                                        <div>
                                            <h6 className="mb-0">{item.product?.name}</h6>
                                            <small className="text-muted">{item.product?.category}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button 
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => removeFromCart(item.product.productId, 1)}
                                        >-</button>
                                        
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm text-center mx-2"
                                            style={{ width: '60px' }}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.product.productId, item.quantity, e.target.value)}
                                        />

                                        <button 
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => addToCart(item.product.productId, 1)}
                                        >+</button>
                                    </div>
                                    <div className="fw-bold" style={{ width: '15%', textAlign: 'end' }}>
                                        ₪{(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        className="btn btn-link text-danger p-0 ms-3"
                                        onClick={() => removeFromCart(item.product.productId, item.quantity)}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <h4 className="card-title mb-4">סיכום הזמנה</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span>סכום ביניים:</span>
                                <span>₪{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span>משלוח:</span>
                                <span className="text-success">חינם</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="h4 fw-bold">סה"כ לתשלום:</span>
                                <span className="h4 fw-bold text-primary">₪{cartTotal.toFixed(2)}</span>
                            </div>
                            <button 
                                className="btn btn-success w-100 btn-lg"
                                onClick={() => navigate('/checkout')}
                            >
                                עבור לתשלום 💳
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}