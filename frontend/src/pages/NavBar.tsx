import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UseAuth.store";
import { useCartStore } from "../store/UseCart.store"
import { UserRole } from "../features/user/types";
import { useEffect, useState } from "react"; 

export const NavBar = () => {
    const { user, logout } = useAuthStore();
    const { cart, fetchCart, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            clearCart();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        clearCart();
        setIsMenuOpen(false);
        navigate('/login');
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    }
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const cartCount = cart?.cartItems?.length || 0;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/" onClick={closeMenu}>🛍️ החנות שלי</Link>
                
               
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleMenu} 
                    aria-controls="navbarNav" 
                    aria-expanded={isMenuOpen} 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={closeMenu}>בית</Link>
                        </li>
                        
                        {user?.role === UserRole.ADMIN && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-warning" to="/admin/users" onClick={closeMenu}>ניהול משתמשים</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-warning" to="/admin/products" onClick={closeMenu}>ניהול מוצרים</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex gap-2 align-items-center flex-column flex-lg-row"> 
                        {user ? (
                            <>
                                <span className="text-light me-2">
                                    שלום, {user.firstName}
                                </span>
                                
                                <Link to="/orders" className="btn btn-outline-light btn-sm w-100 w-lg-auto" onClick={closeMenu}>
                                    ההזמנות שלי
                                </Link>

                                <Link to="/cart" className="btn btn-primary btn-sm position-relative w-100 w-lg-auto" onClick={closeMenu}>
                                    🛒 עגלה
                                    {cartCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <button onClick={handleLogout} className="btn btn-danger btn-sm w-100 w-lg-auto">
                                    התנתק
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-light btn-sm w-100 w-lg-auto" onClick={closeMenu}>התחבר</Link>
                                <Link to="/register" className="btn btn-light btn-sm w-100 w-lg-auto" onClick={closeMenu}>הירשם</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};