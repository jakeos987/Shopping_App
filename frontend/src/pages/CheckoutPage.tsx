import { useCartStore } from '../store/UseCart.store'
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const { cart } = useCartStore();
    const navigate = useNavigate();
    const total = cart?.cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;

    const handlePayment = () => {
        alert("תשלום בוצע בהצלחה! ההזמנה נשלחה.");
        navigate('/'); 
    };
    return (
        <div className="container mt-5">
            <h2 className="mb-4">קופה ותשלום 💳</h2>
            <div className="row">
                <div className="col-md-8">
                    <form className="card p-4 shadow-sm">
                        <h4 className="mb-3">פרטים אישיים</h4>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">שם מלא</label>
                                <input type="text" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">כתובת למשלוח</label>
                                <input type="text" className="form-control" required />
                            </div>
                            <div className="col-12">
                                <label className="form-label">מספר אשראי</label>
                                <input type="text" className="form-control" placeholder="0000 0000 0000 0000" />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="col-md-4">
                    <div className="card p-3 shadow-sm bg-light">
                        <h4>סיכום</h4>
                        <div className="d-flex justify-content-between mt-3">
                            <span className="fw-bold">סה"כ לתשלום:</span>
                            <span className="fw-bold text-primary">₪{total.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary w-100 mt-4" onClick={handlePayment}>
                            בצע תשלום
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}