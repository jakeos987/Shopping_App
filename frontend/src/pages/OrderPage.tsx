import { useEffect, useState } from "react";
import {type Order } from "../features/orders/types";
import { Link } from "react-router-dom";
import { orderService } from "../services/Order.Srvice";

export default function OrderPage(){
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        loadOrders()
    },[])
    const loadOrders= async()=>{
        try{
            const data = await orderService.getAll()
            setOrders(data)
        }catch(err){
            console.error("faild to load orders",err)
        }finally{
            setLoading(false)
        }
    }
    if(loading) return <div className="text-center mt-5">...טוען הזמנות</div>
    if(orders.length===0) return(
        <div className="container mt-5 text-center">
                <h2>אין לך עדיין הזמנות 📦</h2>
                <Link to="/" className="btn btn-primary mt-3">התחל לקנות</Link>
        </div>
    )
    return(<div className="container mt-5">
            <h2 className="mb-4">ההזמנות שלי</h2>
            <div className="row g-4">
                {orders.map((order) => (
                    <div key={order.orderId} className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                {/* 👇 תיקון 1: רק תאריך בכותרת */}
                                <div>
                                    <span className="fw-bold fs-5">
                                        {new Date(order.orderDate).toLocaleDateString('he-IL')}
                                    </span>
                                </div>
                                <span className={`badge ${order.orderStatus === 'PENDING' ? 'bg-warning' : 'bg-success'}`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-borderless mb-0">
                                        <tbody>
                                            {order.orderItems.map((item) => (
                                                <tr key={item.orderItemId}>
                                                    <td style={{width: '60px'}}>
                                                        <img 
                                                            src={item.product?.imageUrl || 'https://placehold.co/40'} 
                                                            alt="" 
                                                            style={{width: '40px', height: '40px', objectFit: 'cover'}}
                                                            className="rounded"
                                                        />
                                                    </td>
                                                    <td>{item.product?.name || 'מוצר'}</td>
                                                    <td>x{item.quantity}</td>
                                                    {/* 👇 תיקון 2: חישוב מחיר כפול כמות */}
                                                    <td className="text-end">
                                                        ₪{(Number(item.price) * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">סה"כ שולם:</span>
                                    <span className="fw-bold text-primary fs-5">₪{Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}