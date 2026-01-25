import { useEffect, useState } from "react";
import { userService } from "../services/User.Service";
import { type User, UserRole } from '../features/user/types'
import { useAuthStore } from '../store/UseAuth.store'

export default function AdminUserPage(){
    const [user, setUser] = useState<User[]>([])
    const { user: currentUser } = useAuthStore()
    useEffect(()=>{
        loadUsers()
    },[])
    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            const admins = data.filter(u => u.role && u.role.toUpperCase() === 'ADMIN');
            const regularUsers = data.filter(u => !u.role || u.role.toUpperCase() !== 'ADMIN');
            setUser([...admins, ...regularUsers]);

        } catch (error) {
            console.error("Failed to load users", error);
        }
    };
   const handleRoleChange = async (userId: number, currentRole: UserRole) => {
    if (currentUser && userId === currentUser.id) {
        alert("אתה לא יכול לשנות הרשאות לעצמך");
        return
        }
         const newRole = currentRole===UserRole.ADMIN ?UserRole.USER : UserRole.ADMIN
        const confirmChange = newRole === UserRole.ADMIN
        ? "?האם אתה בטוח שברצונך לקדם משתמש זה למנהל"
        : "?האם אתה בטוח שברצונך להוריד משתמש זה לתפקיד רגיל";
        if(!window.confirm(confirmChange)) return
        try{
            await userService.updateUserRole(userId, newRole)
            setUser(prevUsers =>{
                const updatedList = prevUsers.map(u=>u.id===userId?{...u, role:newRole}:u)

                const admins = updatedList.filter(user=> user.role=== UserRole.ADMIN)
                const regulars = updatedList.filter(u=>u.role!== UserRole.ADMIN)
                return [...admins, ...regulars]
            })
        }catch(err){
            console.error(err)
            alert('שגיאה בעדכון תפקיד המשתמש')
        }
   }
   const handleDelete = async (userId: number) => {
        if (!window.confirm("האם למחוק את המשתמש לצמיתות? פעולה זו אינה הפיכה!")) return;

        try {
            await userService.remove(userId);
            setUser(prevUsers => prevUsers.filter(u => u.id !== userId));
        } catch (error) {
            console.error(error);
            alert("שגיאה במחיקת המשתמש");
        }
    };
    return(
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
                        {user.map(userRow => {
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
                                            <button 
                                                disabled={isMe}
                                                className={`btn btn-sm ${userRow.role === UserRole.ADMIN ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                onClick={() => handleRoleChange(userRow.id, userRow.role)}
                                                style={{ opacity: isMe ? 0.5 : 1 }} 
                                            >
                                                {userRow.role === UserRole.ADMIN ? 'user-הפוך ל' : 'admin-הפוך ל'}
                                            </button>
                                            
                                            {!isMe && (
                                                <button 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(userRow.id)}
                                                >
                                                    מחק 🗑️
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
        </div>
    )
        
}