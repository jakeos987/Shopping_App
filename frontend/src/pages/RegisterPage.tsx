import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/UseAuth.store";
import { AuthService } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('סיסמאות לא תואמות')
            return
        }
        if (password.length < 8) {
            setError('הסיסמא חייבת להכיל לפחות 8 תווים')
            return;
        }
        if (!firstName || !lastName) {
            setError('חובה לשים שם פרטי ומשפחה')
        }
        try {
            const data = await AuthService.register({ email, password, firstName, lastName })

            if (data.token) {
                setAuth(data.user, data.token)
                navigate('/')
            }
            else {
                navigate('/login')
            }
        } catch (err: any) {
            console.error(err)
            setError(err.response.data.message || 'שגיאה בהרשמה תנסה עוד פעם')
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">הרשמה למערכת</h3>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Google Register Button */}
                            <button
                                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
                                className="btn btn-outline-danger w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352-2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.001c-1.633 0-2.868 1.022-3.39 2.581C4.444 6.136 4.333 6.708 4.333 7.333c0 .624.111 1.196.278 1.752.522 1.559 1.757 2.58 3.39 2.58 1.488 0 2.548-.813 3.033-1.875H8v-3.333h7.545z" />
                                </svg>
                                הירשם עם Google
                            </button>

                            <div className="text-center text-muted mb-3">- או -</div>

                            <form onSubmit={handlerSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">כתובת אימייל</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">שם פרטי</label>
                                    <input type="text"
                                        className="form-control"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">שם משפחה</label>
                                    <input type="text"
                                        className="form-control"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />

                                </div>
                                <div className="mb-3">
                                    <label className="form-label">סיסמא</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">אימות סיסמא</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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