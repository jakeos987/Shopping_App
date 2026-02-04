import { useEffect, useState } from "react";
import { userService } from "../services/User.Service";
import { type User, UserRole } from '../features/user/types'
import { useAuthStore } from '../store/UseAuth.store'
import { orderService } from "../services/Order.Srvice";
import { type Order, OrderStatus } from "../features/orders/types";

export default function AdminUserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { user: currentUser } = useAuthStore();

    // Modal State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserOrders, setSelectedUserOrders] = useState<Order[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            const admins = data.filter(u => u.role && u.role.toUpperCase() === 'ADMIN');
            const regularUsers = data.filter(u => !u.role || u.role.toUpperCase() !== 'ADMIN');
            setUsers([...admins, ...regularUsers]);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    const handleRoleChange = async (userId: number, currentRole: UserRole) => {
        if (currentUser && userId === currentUser.id) {
            alert("אתה לא יכול לשנות הרשאות לעצמך");
            return;
        }
        const newRole = currentRole === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
        const confirmChange = newRole === UserRole.ADMIN
            ? "?האם אתה בטוח שברצונך לקדם משתמש זה למנהל"
            : "?האם אתה בטוח שברצונך להוריד משתמש זה לתפקיד רגיל";

        if (!window.confirm(confirmChange)) return;

        try {
            await userService.updateUserRole(userId, newRole);
            setUsers(prevUsers => {
                const updatedList = prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
                const admins = updatedList.filter(user => user.role === UserRole.ADMIN);
                const regulars = updatedList.filter(u => u.role !== UserRole.ADMIN);
                return [...admins, ...regulars];
            });
        } catch (err) {
            console.error(err);
            alert('שגיאה בעדכון תפקיד המשתמש');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm("האם למחוק את המשתמש לצמיתות? פעולה זו אינה הפיכה!")) return;

        try {
            await userService.remove(userId);
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        } catch (error) {
            console.error(error);
            alert("שגיאה במחיקת המשתמש");
        }
    };

    const handleViewOrders = async (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setLoadingOrders(true);
        try {
            // Note: Ensure currentUser.id is defined if needed elsewhere, but here we pass user.id to API
            const orders = await orderService.getOrdersByUser(user.id);
            // Sort by date desc
            const sorted = orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            setSelectedUserOrders(sorted);
        } catch (error) {
            console.error("Failed to load orders", error);
            alert("שגיאה בטעינת הזמנות");
            setSelectedUserOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        if (!window.confirm(`?האם לשנות סטטוס ל-${newStatus}`)) return;
        try {
            await orderService.updateStatus(orderId, newStatus);
            setSelectedUserOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus as OrderStatus } : o));
        } catch (error) {
            console.error(error);
            alert("שגיאה בעדכון סטטוס");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedUserOrders([]);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">ניהול משתמשים (Admin) 👥</h2>
            <div className="table-responsive shadow bg-white rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>שם מלא</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(userRow => {
                            const isMe = userRow.id === currentUser?.id;
                            return (
                                <tr key={userRow.id} className={isMe ? "table-active" : ""}>
                                    <td>
                                        {userRow.firstName} {userRow.lastName}
                                        {isMe && <span className="badge bg-primary ms-2">אתה</span>}
                                    </td>
                                    <td>{userRow.email}</td>
                                    <td>
                                        <span className={`badge ${userRow.role === UserRole.ADMIN ? 'bg-danger' : 'bg-info'}`}>
                                            {userRow.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {/* Button to view orders */}
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleViewOrders(userRow)}
                                                title="צפה בהזמנות"
                                            >
                                                📦 הזמנות
                                            </button>

                                            <button
                                                disabled={isMe}
                                                className={`btn btn-sm ${userRow.role === UserRole.ADMIN ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                onClick={() => handleRoleChange(userRow.id, userRow.role)}
                                                style={{ opacity: isMe ? 0.5 : 1 }}
                                            >
                                                {userRow.role === UserRole.ADMIN ? 'הפוך ל-User' : 'הפוך ל-Admin'}
                                            </button>

                                            {!isMe && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(userRow.id)}
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Orders Modal */}
            {isModalOpen && selectedUser && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">הזמנות של {selectedUser.firstName} {selectedUser.lastName}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {loadingOrders ? (
                                    <div className="text-center p-3">טוען הזמנות... ⏳</div>
                                ) : selectedUserOrders.length === 0 ? (
                                    <div className="text-center p-3">למשתמש זה אין הזמנות.</div>
                                ) : (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>מספר הזמנה</th>
                                                <th>תאריך</th>
                                                <th>סכום</th>
                                                <th>סטטוס</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedUserOrders.map(order => (
                                                <tr key={order.orderId}>
                                                    <td>#{order.orderId}</td>
                                                    <td>{new Date(order.orderDate).toLocaleDateString("he-IL")}</td>
                                                    <td>₪{Number(order.totalAmount).toFixed(2)} ({order.orderItems?.length || 0} פריטים)</td>
                                                    <td>
                                                        <select
                                                            className={`form-select form-select-sm ${order.status === 'PENDING' ? 'bg-warning' :
                                                                    order.status === 'SHIPPED' ? 'bg-info' :
                                                                        order.status === 'DELIVERED' ? 'bg-success text-white' :
                                                                            'bg-danger text-white'
                                                                }`}
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                        >
                                                            <option value="PENDING">ממתין (PENDING)</option>
                                                            <option value="SHIPPED">נשלח (SHIPPED)</option>
                                                            <option value="DELIVERED">נמסר (DELIVERED)</option>
                                                            <option value="CANCELLED">בוטל (CANCELLED)</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>סגור</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}