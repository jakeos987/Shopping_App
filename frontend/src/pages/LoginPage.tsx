import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/UseAuth.store';
import { AuthService } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function LoginPage(){
    const [email, setEmail]= useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const setAuth = useAuthStore((state)=> state.setAuth)
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
    
        try{
            const data = await AuthService.login({email,password})
            setAuth(data.user,data.token);
            navigate('/')
        }catch(err:any){
            console.log(err)
            setError('אמייל או סיסמא שגויים')
        }
    }
    return(
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <h3 className="text-center mb-4">התחברות למערכת</h3>
                        {error &&(
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        {/*פה השדה של המייל */}
                        <form onSubmit={handleSubmit}>
                            <div className="md-3">
                                <label htmlFor="email" className="form-lable">כתובת אימייל</label>
                                <input 
                                type="email" //text  אפשר לעשות  לבדיקות 
                                className="form-control"//זה מתאים את הגודל של הבלוק לפי הסביבה
                                id="email"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)} //בלחיצה מעדכן את האימייל לאימייל שנכנס
                                required //מחייב את הלקוח לכתתוב משהו ולא להשאיר ריק
                                autoFocus //זה שם את הסימן המהבהב כדי שהשדה יהיה מוכן לכתיבה
                                 />
                            </div>
                            {/*כאן מכניסים סיסמא*/}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">סיסמא</label>
                            <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                            />
                            {/* כאן הכפתור שליחה*/}
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">
                        התחבר
                        </button>
                        </form>
                        <div className="mt-3 text-center">
                            <small>
                                אין לך חשבון? <Link to="/register"></Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}