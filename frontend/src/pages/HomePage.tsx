import { useEffect, useState } from "react";
import { type Product } from "../features/products/types";
import { productService } from "../services/ProductService"; 
import { ProductCard } from "../features/products/components/ProductCard";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // סטייט לפתיחת/סגירת המגירה (Offcanvas)
    const [showSidebar, setShowSidebar] = useState(false);

    // שדות הסינון
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        handleFilter(); 
    }, []);

    const handleFilter = async () => {
        setLoading(true);
        setError('');
        
        try {
            const filterDto: any = {};
            if (search) filterDto.search = search;
            if (category) filterDto.category = category;
            if (minPrice) filterDto.minPrice = minPrice;
            if (maxPrice) filterDto.maxPrice = maxPrice;

            console.log("📤 Sending Filter Request:", filterDto);

            const hasFilters = search || category || minPrice || maxPrice;
            
            let data;
            if (hasFilters) {
                data = await productService.getFilter(filterDto);
            } else {
                data = await productService.getAll();
            }

            console.log(" Received Data:", data);

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
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        productService.getAll().then(setProducts); 
    };

    return (
        <div className="container-fluid mt-4 px-4 position-relative"> 
            
            {/* --- כותרת וכפתור סינון --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold">החנות שלנו</h1>
                    <p className="text-muted">כל המוצרים במקום אחד</p>
                </div>
                
                <button 
                    className="btn btn-dark d-flex align-items-center gap-2"
                    onClick={() => setShowSidebar(true)}
                >
                    <span>סינון וחיפוש</span>
                    <span>🔍</span>
                </button>
            </div>

            {/* --- תפריט צד (Offcanvas / Drawer) --- */}
            {/* הרקע הכהה (Backdrop) */}
            {showSidebar && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                    style={{ opacity: 0.5, zIndex: 1040 }}
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            {/* הסרגל עצמו */}
            <div 
                className={`position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4 transition-all`}
                style={{ 
                    width: '320px', 
                    zIndex: 1050,
                    transform: showSidebar ? 'translateX(0)' : 'translateX(100%)', // אפקט החלקה
                    transition: 'transform 0.3s ease-in-out',
                    overflowY: 'auto' // גלילה אם הסינון ארוך
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h4 className="m-0">סינון מוצרים</h4>
                    <button className="btn btn-close" onClick={() => setShowSidebar(false)}></button>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Search Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select 
                        className="form-select" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="GAMING">GAMING</option>
                        <option value="CLOTHING">CLOTHING</option>
                        <option value="ELECTRONICS">ELECTRONICS</option>
                        <option value="BOOKS">BOOKS</option>
                        <option value="HOME">HOME</option>
                        <option value="SPORTS">SPORTS</option>
                        <option value="BEAUTY">BEAUTY</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Price Range</label>
                    <div className="d-flex gap-2">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Min" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Max" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                    <button className="btn btn-primary" onClick={handleFilter}>
                        Apply Filters
                    </button>
                    <button className="btn btn-outline-secondary" onClick={clearFilters}>
                        Clear All
                    </button>
                </div>
            </div>

            {/* --- רשימת המוצרים (תמיד מסך מלא) --- */}
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
                                // הכרטיסים תמיד מקבלים מקום אחיד כי הסרגל לא מפריע
                                <div key={product.productId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h3>No products found 😕</h3>
                                <p>Try adjusting your filters</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}