import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/UseAuth.store";
import { AuthService } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function RegisterPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const setAuth = useAuthStore((state)=> state.setAuth)
    
    const handlerSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
    if(password !== confirmPassword){
        setError('סיסמאות לא תואמות')
        return
    }
    if(password.length<8){
        setError('הסיסמא חייבת להכיל לפחות 8 תווים')
        return;
    }
    if(!firstName||!lastName){
        setError('חובה לשים שם פרטי ומשפחה')
    }
    try{
        const data = await AuthService.register({email, password, firstName, lastName})

        if (data.token){
            setAuth(data.user,data.token)
            navigate('/')
        }
        else{
            navigate('/login')
        } 
    }catch(err:any){
        console.log(err)
        setError(err.response.data.message || 'שגיאה בהרשמה תנסה עוד פעם')
    }
    }
    return(
        <div className="container mt-5"> 
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">הרשמה למערכת</h3>
                            {error &&(
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handlerSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">כתובת אימייל</label>
                                    <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">שם פרטי</label>
                                    <input type="text"
                                    className="form-control"
                                    value={firstName}
                                    onChange={(e)=>setFirstName(e.target.value)}
                                    required
                                    />
                                </div>
                                <div className="mb-3">
                                <label className="form-label">שם משפחה</label>
                                    <input type="text"
                                    className="form-control"
                                    value={lastName}
                                    onChange={(e)=>setLastName(e.target.value)}
                                    required
                               />

                                </div>
                                <div className="mb-3">
                                    <label className="form-label">סיסמא</label>
                                    <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">אימות סיסמא</label>
                                    <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e)=>setConfirmPassword(e.target.value)}
                                    required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100 mt-3">
                                    הירשם
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <small>
                                    <Link to="/login"> ?יש לך חשבון</Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}