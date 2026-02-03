import { useEffect, useState } from "react";
import { orderService } from "../services/Order.Srvice"; // וודא שהשם Service כתוב נכון
import toast from "react-hot-toast";
import { type Order } from '../features/orders/types'


export default function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAll();
                // מיון שההזמנה הכי חדשה תהיה למעלה
                const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(sorted);
            } catch (error) {
                console.error(error);
                toast.error("לא הצלחנו לטעון את ההזמנות");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center mt-5">טוען הזמנות... ⏳</div>;

    if (orders.length === 0) {
        return <div className="text-center mt-5">עדיין לא ביצעת הזמנות 📦</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">ההזמנות שלי 📦</h2>
            
            <div className="row">
                <div className="col-12">
                    {orders.map((order) => (
                        <div key={order.orderId} className="card mb-3 shadow-sm border-0">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>הזמנה #{order.orderId}</strong>
                                    <span className="text-muted ms-2">
                                        {new Date(order.orderDate).toLocaleDateString('he-IL')}
                                    </span>
                                </div>
                                <div>
                                    <span className={`badge ${order.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    {order.orderItems?.map((item, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between">
                                            <span>
                                                {item.productName} 
                                                <span className="badge bg-secondary ms-2 rounded-pill">x{item.quantity}</span>
                                            </span>
                                            <span>₪{Number(item.price).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 text-end border-top pt-2">
                                    <strong>סה"כ שולם: </strong>
                                    <span className="text-primary fw-bold fs-5">
                                        ₪{Number(order.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}