import { useEffect, useState } from "react";
import { type Product, type Category } from "../features/products/types";
import { productService } from "../services/ProductService";
import { ProductCard } from "../features/products/components/ProductCard";
import { useAuthStore } from "../store/UseAuth.store";
import { ProductDetailsModal } from "../features/products/components/ProductDetailsModal";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();
    const [showSidebar, setShowSidebar] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Product Details Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Filter States
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const cats = await productService.getCategories();
            setCategories(cats);
            await handleFilter();
        } catch (err) {
            console.error("Error loading initial data", err);
        }
    };

    const handleFilter = async () => {
        setLoading(true);
        setError('');

        try {
            const filterDto: any = {};
            if (search) filterDto.search = search;
            if (categoryId) filterDto.categoryId = Number(categoryId);
            if (minPrice) filterDto.minPrice = minPrice;
            if (maxPrice) filterDto.maxPrice = maxPrice;

            const hasFilters = search || categoryId || minPrice || maxPrice;

            let data;
            if (hasFilters) {
                data = await productService.getFilter(filterDto);
            } else {
                data = await productService.getAll();
            }

            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }

        } catch (err) {
            console.error("Filter Error:", err);
            setError('שגיאה בטעינת המוצרים');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryId("");
        setMinPrice("");
        setMaxPrice("");
        productService.getAll().then(setProducts);
    };

    return (
        <div className="container-fluid mt-4 px-4 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold">החנות שלנו</h1>
                    {user ? (
                        <p className="text-muted fs-5">
                            שלום, <span className="text-primary fw-bold">{user.firstName} {user.lastName}</span> 👋
                        </p>
                    ) : (
                        <p className="text-muted">כל המוצרים במקום אחד</p>
                    )}
                </div>

                {/* כפתור הסינון */}
                <button
                    className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => setShowSidebar(true)}
                    style={{ height: 'fit-content' }} 
                >
                    <span>סינון וחיפוש</span>
                    <span>🔍</span>
                </button>
            </div>


            {/* תפריט צד  */}
            {showSidebar && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                    style={{ opacity: 0.5, zIndex: 1040 }}
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            <div
                className={`position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4 transition-all`}
                style={{
                    width: '320px',
                    zIndex: 1050,
                    transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease-in-out',
                    overflowY: 'auto'
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h4 className="m-0">סינון מוצרים</h4>
                    <button className="btn btn-close" onClick={() => setShowSidebar(false)}></button>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">חיפוש חופשי</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="שם המוצר..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">קטגוריה</label>
                    <select
                        className="form-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">כל הקטגוריות</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">טווח מחירים</label>
                    <div className="d-flex gap-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="מינימום"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="מקסימום"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                    <button className="btn btn-primary" onClick={handleFilter}>
                        החל סינון
                    </button>
                    <button className="btn btn-outline-secondary" onClick={clearFilters}>
                        נקה הכל
                    </button>
                </div>
            </div>

            {/* --- רשימת המוצרים --- */}
            <div className="row g-4">
                {loading && (
                    <div className="d-flex justify-content-center my-5 w-100">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                )}

                {error && <div className="alert alert-danger w-100">{error}</div>}

                {!loading && !error && (
                    <>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.productId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <ProductCard
                                        product={product}
                                        onProductClick={setSelectedProduct}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h3>לא נמצאו מוצרים 😕</h3>
                                <p>נסה לשנות את הסינון</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}