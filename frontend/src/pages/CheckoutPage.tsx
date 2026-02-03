import { useState } from "react";
import { useCartStore } from "../store/UseCart.store";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/Order.Srvice";

export default function CheckoutPage() {
    const { cart, fetchCart } = useCartStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Form state
    const [shippingAddress, setShippingAddress] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState(""); // Not sent to backend yet but good for UX

    const total = cart?.cartItems?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default since we wrapped in form
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            await orderService.checkout({
                shippingAddress,
                city,
                phone
            });
            await fetchCart();
            alert("ההזמנה בוצעה בהצלחה! תודה שקנית אצלנו 🎉");
            navigate('/orders');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "אירעה שגיאה בביצוע ההזמנה";
            alert("שגיאה: " + message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h3>העגלה שלך ריקה, אי אפשר לבצע הזמנה.</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>חזור לחנות</button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">קופה ותשלום 💳</h2>
            <div className="row">
                <div className="col-md-8">
                    <form className="card p-4 shadow-sm" onSubmit={handlePayment}>
                        <h4 className="mb-3">פרטים אישיים</h4>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">שם מלא</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">עיר</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">כתובת למשלוח</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">טלפון</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">מספר אשראי (דמה)</label>
                                <input type="text" className="form-control" placeholder="0000 0000 0000 0000" />
                            </div>
                        </div>

                        {/* Move Submit button inside form to trigger validation */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-success w-100 btn-lg"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        מעבד הזמנה...
                                    </span>
                                ) : "בצע תשלום וסיים הזמנה"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-md-4">
                    <div className="card p-3 shadow-sm bg-light">
                        <h4>סיכום</h4>

                        <ul className="list-group list-group-flush my-3 bg-transparent">
                            {cart.cartItems.map(item => (
                                <li key={item.cartItemId} className="list-group-item d-flex justify-content-between bg-transparent px-0">
                                    <span>
                                        {item.product.name.length > 20 ? item.product.name.substring(0, 18) + '...' : item.product.name}
                                        <span className="text-muted fw-bold ms-1">x{item.quantity}</span>
                                    </span>
                                    <span>₪{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="d-flex justify-content-between mt-3 border-top pt-3">
                            <span className="fw-bold">סה"כ לתשלום:</span>
                            <span className="fw-bold text-primary fs-5">₪{total.toFixed(2)}</span>
                        </div>

                        {/* Button removed from here, moved into form */}
                    </div>
                </div>
            </div>
        </div>
    );
}