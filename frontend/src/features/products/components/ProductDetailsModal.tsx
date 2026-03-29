import type { Product } from "../types";
import { useCartStore } from "../../../store/UseCart.store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductDetailsModalProps {
    product: Product;
    onClose: () => void;
}

export const ProductDetailsModal = ({ product, onClose }: ProductDetailsModalProps) => {
    const { addToCart } = useCartStore();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await addToCart(product.productId, 1);
            toast.success("המוצר נוסף לעגלה! 🛒", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            console.error(error);
            toast.error("שגיאה בהוספה לעגלה");
        } finally {
            setAdding(false);
        }
    };

    const handleBuyNow = async () => {
        setAdding(true);
        try {
            await addToCart(product.productId, 1);
            toast.success("המוצר נוסף לעגלה! מתקדמים לתשלום...");
            onClose();
            navigate('/checkout');
        } catch (error) {
            console.error(error);
            toast.error("שגיאה בהוספה לעגלה");
        } finally {
            setAdding(false);
        }
    };

    return (
        // z-index increased to ensure it's above other elements
        // onClick={onClose} allows closing when clicking the backdrop
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                {/* stopPropagation preventing modal close when clicking inside the content */}
                <div className="modal-content overflow-hidden position-relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="btn-close position-absolute"
                        onClick={onClose}
                        style={{ top: '1rem', right: '1rem', zIndex: 1060, cursor: 'pointer' }}
                    ></button>
                    <div className="modal-body pt-4">
                        <div className="row g-4">
                            {/* Product Image */}
                            <div className="col-md-5 d-flex align-items-center justify-content-center bg-light rounded shadow-sm p-3">
                                <img
                                    src={product.imageUrl || "https://via.placeholder.com/300"}
                                    alt={product.name}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                                />
                            </div>

                            {/* Product Details */}
                            <div className="col-md-7 d-flex flex-column justify-content-between">
                                <div>
                                    <h2 className="fw-bold mb-2">{product.name}</h2>
                                    <h4 className="text-primary mb-3">₪{Number(product.price).toFixed(2)}</h4>

                                    <div className="mb-4">
                                        <h6 className="fw-bold text-muted">תיאור המוצר:</h6>
                                        <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                            {product.description || "אין תיאור זמין למוצר זה."}
                                        </p>
                                    </div>

                                    {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                                        <div className="alert alert-warning py-2 mb-3">
                                            ⚠️ נשארו {product.stockQuantity} !יחידות אחרונות
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2 d-md-flex mt-3">
                                    <button
                                        className="btn btn-primary flex-grow-1 py-2"
                                        onClick={handleAddToCart}
                                        disabled={adding || product.stockQuantity === 0}
                                    >
                                        🛒 הוסף לעגלה
                                    </button>
                                    <button
                                        className="btn btn-success flex-grow-1 py-2"
                                        onClick={handleBuyNow}
                                        disabled={adding || product.stockQuantity === 0}
                                    >
                                        ⚡ קנה עכשיו
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
