import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/UseAuth.store';
import { AuthService } from "../services/auth.service";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            checkGoogleLogin(token);
        }
    }, [searchParams]);

    const checkGoogleLogin = async (token: string) => {
        try {
            // Temporarily set token in store to ensure interceptor uses it
            useAuthStore.setState({ token: token });

            const user = await AuthService.getProfile();
            setAuth(user, token);
            navigate('/');
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError('שגיאה בהתחברות עם גוגל');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await AuthService.login({ email, password });
            setAuth(data.user, data.token);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('אמייל או סיסמא שגויים');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">התחברות למערכת</h3>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Google Login Button */}
                            <button
                                onClick={handleGoogleLogin}
                                className="btn btn-outline-danger w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352-2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.001c-1.633 0-2.868 1.022-3.39 2.581C4.444 6.136 4.333 6.708 4.333 7.333c0 .624.111 1.196.278 1.752.522 1.559 1.757 2.58 3.39 2.58 1.488 0 2.548-.813 3.033-1.875H8v-3.333h7.545z" />
                                </svg>
                                התחבר עם Google
                            </button>

                            <div className="text-center text-muted mb-3">- או -</div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">כתובת אימייל</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">סיסמא</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-3">
                                    התחבר
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <small>
                                    <Link to="/register">אין לך חשבון? הרשם כאן</Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}