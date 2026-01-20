import { type Product } from "../types";
import { useAuthStore } from '../../../store/UseAuth.store';
import { useCartStore } from '../../../store/UseCart.store';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
    product: Product
}

export const ProductCard = ({ product }: Props) => {
    const token = useAuthStore((state) => state.token);
    const addToCart = useCartStore((state) => state.addToCart);
    const isActivated = !!token;
    const navigate = useNavigate();
    
    // מצב טעינה מקומי לכפתור
    const [adding, setAdding] = useState(false);

    const handlerSubmit = async () => {
        setAdding(true);
        try {
            // וודא ש-product.productId הוא השם הנכון ב-Type שלך (אולי זה product.id?)
            await addToCart(product.productId, 1);
            // אפשר להשתמש ב-Toast במקום Alert לחוויה טובה יותר בעתיד
            alert(`הוספת את ${product.name} לסל`);
        } catch (error) {
            console.error(error);
            alert("שגיאה בהוספה לסל");
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="col-md-4 col-sm-6 mb-4"> {/* col-sm-6 מוסיף רספונסיביות למובייל */}
            <div className="card h-100 shadow-sm border-0"> {/* border-0 לעיצוב נקי יותר */}
                
                {/* אזור התמונה */}
                <div style={{ height: '200px', overflow: 'hidden' }} className="bg-light d-flex align-items-center justify-content-center">
                    <img 
                        src={product.imageUrl }
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                    />
                </div>

                <div className="card-body d-flex flex-column">
                
                    <h5 className="card-title text-center mb-3">{product.name}</h5>
                    
                    <div className="mb-3 text-center">
                        <span className="badge bg-light text-dark border">
                            {product.category}
                        </span>
                    </div>
                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="h5 mb-0 text-primary fw-bold">₪{product.price}</span>
                            
                            {isActivated ? (
                                <button 
                                    className={`btn ${product.stockQuantity > 0 ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={handlerSubmit}
                                    disabled={product.stockQuantity === 0 || adding}
                                >
                                    {adding ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            מוסיף...
                                        </>
                                    ) : (
                                        product.stockQuantity > 0 ? "🛒 הוסף" : "אזל המלאי"
                                    )}
                                </button>
                            ) : (
                                <button 
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => navigate('/login')}
                                >
                                    התחבר לקנייה
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}