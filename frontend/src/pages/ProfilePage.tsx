import { useState, useEffect } from "react";
import { useAuthStore } from "../store/UseAuth.store";
import { userService } from "../services/User.Service";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'
// import { type User } from "../features/user/types";

export default function ProfilePage(){
    const {user, token } = useAuthStore()
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)

    useEffect(()=>{
        if(user){
            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
        }
    },[user])
    const handleUpdate = async (e:React.FormEvent)=>{
        e.preventDefault()
        if(!user) return
        if(password && password !== confirmPassword){
            toast.error('הסיסמאות לא תואמות')
            return
        }
        setLoading(true)
        try{
            const updateData:any={
                firstName,
                lastName
            }
            if(password){
                updateData.password = password
            }
            await userService.update(user.id, updateData)
            toast.success('הפרופיל עודכן בהצלחה')
            setPassword("")
            setConfirmPassword('')
        }catch(err){
        console.error(err)
        toast.error('שגיאה בעידכון פרופיל')
        }finally{
            setLoading(false)
        }
    }
    if(!token){
        return <div className="text-center mt-5"  >
            <Link to='/login'>אנא התחבר כדי שיהיה לך פרופיל</Link>
        </div>
    }
    return(
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-0 pt-4 text-center">
                            <div className="display-1 mb-2">👤</div>
                            <h3>הפרופיל שלי</h3>
                            <p className="text-muted">{user?.email}</p>
                        </div>
                        
                        <div className="card-body p-4">
                            <form onSubmit={handleUpdate}>
                                {/* פרטים אישיים */}
                                <h5 className="mb-3 text-primary">פרטים אישיים</h5>
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">שם פרטי</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">שם משפחה</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/* שינוי סיסמה */}
                                <h5 className="mb-3 text-primary">שינוי סיסמה (אופציונלי)</h5>
                                <div className="mb-3">
                                    <label className="form-label">סיסמה חדשה</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="השאר ריק אם אינך רוצה לשנות"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                
                                {password && (
                                    <div className="mb-4">
                                        <label className="form-label">אימות סיסמה</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="הקלד את הסיסמה שוב"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="d-grid mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg" 
                                        disabled={loading}
                                    >
                                        {loading ? "שומר..." : "שמור שינויים 💾"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}