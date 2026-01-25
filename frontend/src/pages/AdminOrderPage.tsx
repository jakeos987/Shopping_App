import { useEffect, useState } from "react";
import { type Order } from "../features/orders/types";
import { orderService } from "../services/Order.Srvice"; // וודא שהאינטרפייס מיובא נכון

// סטטוסים אפשריים (אפשר להוסיף עוד)
const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAll();
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            // עדכון מקומי בטבלה כדי שלא נצטרך לרענן הכל
            setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
            alert("סטטוס עודכן בהצלחה! ✅");
        } catch (error) {
            alert("שגיאה בעדכון סטטוס");
        }
    };

    // חישוב צבע לפי סטטוס (בשביל היופי)
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'Shipped': return 'bg-primary';
            case 'Delivered': return 'bg-success';
            case 'Cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    if (loading) return <div className="text-center mt-5">טוען הזמנות...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">ניהול הזמנות (Admin) 📦</h2>
            
            <div className="table-responsive shadow bg-white rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th># הזמנה</th>
                            <th>לקוח</th>
                            <th>תאריך</th>
                            <th>פריטים</th>
                            <th>סה"כ לתשלום</th>
                            <th>סטטוס</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td>#{order.orderId}</td>
                                
                                {/* פרטי לקוח (נזהרים למקרה שהמשתמש נמחק) */}
                                <td>
                                    <div className="fw-bold">{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'משתמש לא ידוע'}</div>
                                    <small className="text-muted">{order.user?.email}</small>
                                </td>
                                
                                <td>{new Date(order.orderDate).toLocaleDateString('he-IL')}</td>
                                
                                {/* פירוט קצר של הפריטים */}
                                <td>
                                    <ul className="list-unstyled mb-0 small">
                                        {order.orderItems.map(item => (
                                            <li key={item.orderItemId}>
                                                {item.quantity}x {item.product.name}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                
                                <td className="fw-bold">₪{Number(order.totalAmount).toFixed(2)}</td>
                                
                                <td>
                                    <select 
                                        className={`form-select form-select-sm text-white ${getStatusBadge(order.orderStatus)} status)}`}
                                        style={{width: '130px', fontWeight: 'bold'}}
                                        value={order.orderStatus}
                                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt} className="bg-white text-dark">
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}