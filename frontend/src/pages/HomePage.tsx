import { useEffect, useState } from "react";
import {type Product } from "../features/products/types";
import { productService } from "../services/ProductService"; 
import { ProductCard } from "../features/products/components/ProductCard";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    
    const [loading, setLoading] = useState(true);
    
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await productService.getAll();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError('לא הצלחנו לטעון את המוצרים. נסה לרענן את העמוד.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 3. התצוגה (JSX)
    return (
        <div className="container mt-5"> {/* container: מרכז את התוכן ונותן שוליים */}
            
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">החנות שלנו</h1>
                <p className="lead text-muted">כל המוצרים הכי שווים במקום אחד</p>
            </div>

            {/* מצב טעינה - מציג ספינר של בוטסטראפ */}
            {loading && (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* מצב שגיאה - מציג הודעה אדומה */}
            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            {/* מצב תקין - מציג את המוצרים */}
            {!loading && !error && (
                // row: שורה חדשה. g-4: רווח (Gap) בין הכרטיסים
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))
                    ) : (
                        <div className="text-center">
                            <h3>אין מוצרים כרגע במלאי 📦</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}