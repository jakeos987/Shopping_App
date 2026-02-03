import { useEffect, useState } from "react";
import { type Order } from "../features/orders/types";
import { Link } from "react-router-dom";
import { orderService } from "../services/Order.Srvice"; 

export default function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAll();
            
            if (Array.isArray(data)) {
                // ⭐ תיקון: מיון לפי orderDate
                const sorted = data.sort((a, b) => 
                    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
                );
                setOrders(sorted);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">...טוען הזמנות ⏳</div>;

    if (!orders || orders.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h2>אין לך עדיין הזמנות 📦</h2>
                <Link to="/" className="btn btn-primary mt-3">התחל לקנות</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">ההזמנות שלי</h2>
            <div className="row g-4">
                {orders.map((order) => (
                    <div key={order.orderId} className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold fs-5">
                                        {/* ⭐ תיקון: שימוש ב-orderDate */}
                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('he-IL') : 'תאריך לא זמין'}
                                    </span>
                                </div>
                                <span className={`badge ${order.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                    {order.status || 'סטטוס לא ידוע'}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-borderless mb-0">
                                        <tbody>
                                            {/* ⭐ תיקון: שימוש ב-orderItems והגנה מפני קריסה */}
                                            {order.orderItems && order.orderItems.length > 0 ? (
                                                order.orderItems.map((item, index) => (
                                                    <tr key={item.orderItemId || index}>
                                                        <td style={{ width: '60px' }}>
                                                            <img 
                                                                src={item.product?.imageUrl || 'https://via.placeholder.com/40'} 
                                                                alt="" 
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                className="rounded"
                                                            />
                                                        </td>
                                                        <td>{item.product?.name || item.productName || 'מוצר'}</td>
                                                        <td>x{item.quantity}</td>
                                                        <td className="text-end">
                                                            {/* ⭐ תיקון: שימוש ב-item.price */}
                                                            ₪{(Number(item.price) * item.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-muted">אין פריטים להצגה (ודא שה-Backend שולח Relations)</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">סה"כ שולם:</span>
                                    <span className="fw-bold text-primary fs-5">
                                        ₪{Number(order.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}