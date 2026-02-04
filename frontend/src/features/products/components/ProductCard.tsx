import { type Product } from "../types";
import toast from "react-hot-toast";
import { useAuthStore } from '../../../store/UseAuth.store';
import { useCartStore } from '../../../store/UseCart.store';
import { useNavigate } from "react-router-dom";
import { useState } from "react";


interface Props {
    product: Product;
    onProductClick?: (product: Product) => void;
}

export const ProductCard = ({ product, onProductClick }: Props) => {
    const token = useAuthStore((state) => state.token);
    const addToCart = useCartStore((state) => state.addToCart);
    const isActivated = !!token;
    const navigate = useNavigate();

    // מצב טעינה מקומי לכפתור
    const [adding, setAdding] = useState(false);

    const handlerSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        setAdding(true);
        try {
            await addToCart(product.productId, 1);

            // ⭐ התיקון: במקום alert, הודעה יפה שלא תוקעת את המסך
            toast.success(`${product.name} :נוסף לעגלה`, {
                style: {
                    borderRadius: '1000px',
                    background: 'rgb(94, 95, 93)',
                    color: '#fff',
                },
            });

        } catch (error) {
            console.error(error);
            // גם בשגיאה נשתמש ב-toast
            toast.error("שגיאה בהוספה לסל");
        } finally {
            setAdding(false);
        }
    }

    const handleCardClick = () => {
        if (onProductClick) {
            onProductClick(product);
        }
    };

    return (
        <div className="card h-100 shadow-sm border-0 product-card-hover">

            {/* ⭐ שינוי 2: הקטנת גובה התמונה ושיפור העיצוב */}
            <div
                className="position-relative bg-white p-3 d-flex align-items-center justify-content-center"
                style={{ height: '160px', cursor: 'pointer' }}
                onClick={handleCardClick}
            >
                <img
                    src={product.imageUrl || "https://via.placeholder.com/150"} // תמונת גיבוי אם אין לינק
                    className="img-fluid"
                    alt={product.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />

                {/* התג (Badge) צף על התמונה - נראה יותר מודרני */}
                <span className="position-absolute top-0 end-0 m-2 badge bg-light text-secondary border shadow-sm" style={{ fontSize: '0.7rem' }}>
                    {product.category?.name}
                </span>
            </div>

            <div className="card-body d-flex flex-column p-3">

                {/* כותרת קטנה יותר */}
                <h6
                    className="card-title text-center fw-bold text-truncate mb-2"
                    title={product.name}
                    onClick={handleCardClick}
                    style={{ cursor: 'pointer' }}
                >
                    {product.name}
                </h6>

                {/* מחיר וכפתור בשורה אחת */}
                <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    <span
                        className="text-primary fw-bold"
                        onClick={handleCardClick}
                        style={{ cursor: 'pointer' }}
                    >
                        ₪{product.price}
                    </span>

                    {isActivated ? (
                        <button
                            className={`btn btn-sm ${product.stockQuantity > 0 ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={handlerSubmit}
                            disabled={product.stockQuantity === 0 || adding}
                            style={{ minWidth: '80px' }} // רוחב קבוע לכפתור שלא יקפוץ
                        >
                            {adding ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                product.stockQuantity > 0 ? "+ הוסף" : "חסר"
                            )}
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline-dark btn-sm"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => navigate('/login')}
                        >
                            התחבר
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}