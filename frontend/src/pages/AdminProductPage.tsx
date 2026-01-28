import { useEffect, useState } from "react";
import { productService } from "../services/ProductService"; // וודא שפונקציית restore נמצאת שם
import { type Product } from "../features/products/types";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    
    // ⭐ מצב חדש: האם אנחנו צופים במוצרים פעילים או בסל המחזור?
    const [isTrashMode, setIsTrashMode] = useState(false);

    // --- State לניהול המודלים (חלונות קופצים) ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // --- נתונים לטפסים ---
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // טעינת מוצרים בכל פעם שהמצב (פעיל/זבל) משתנה
    useEffect(() => {
        loadProducts();
    }, [isTrashMode]); // 👈 הוספתי תלות ב-isTrashMode

    const loadProducts = async () => {
        try {
            let data;
            if (isTrashMode) {
                // ⭐ כאן אתה צריך לקרוא לנתיב שמביא מוצרים מחוקים
                // אם אין לך עדיין, תצטרך ליצור ב-Backend נתיב עם withDeleted: true
                // לצורך הדוגמה אני מניח שיש פונקציה כזו:
                data = await productService.getDeleted(); 
            } else {
                data = await productService.getAll();
            }
            setProducts(data); 
        } catch (error) {
            console.error(error);
            // במקרה שאין פונקציית getDeleted עדיין, נאפס כדי לא לשבור
            if(isTrashMode) setProducts([]); 
        }
    };

    // ⭐ פונקציית השחזור החדשה
    const handleRestore = async (id: number) => {
        if (!window.confirm("האם לשחזר את המוצר? ♻️")) return;

        try {
            await productService.restore(id); // הקריאה לשרת
            alert("המוצר שוחזר בהצלחה!");
            loadProducts(); // רענון הטבלה
        } catch (error) {
            console.error(error);
            alert("שגיאה בשחזור המוצר");
        }
    };

    // --- איפוס וסגירת מודלים ---
    const closeModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingId(null);
        setDeleteId(null);
        
        setName("");
        setPrice("");
        setStock("");
        setCategory("");
        setSelectedFile(null);
        
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
    };

    // --- פתיחת מודל יצירה ---
    const openCreateModal = () => {
        closeModals(); 
        setShowEditModal(true);
    };

    // --- פתיחת מודל עריכה ---
    const openEditModal = (p: Product) => {
        closeModals();
        setEditingId(p.productId);
        setName(p.name);
        setPrice(p.price.toString());
        setStock(p.stockQuantity.toString());
        setCategory(p.category || "");
        setShowEditModal(true);
    };

    // --- פתיחת מודל מחיקה ---
    const openDeleteModal = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    // --- שליחת טופס (יצירה או עריכה) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stockQuantity', stock);
        formData.append('category', category);

        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        if (selectedFile) {
        console.log("✅ File found:", selectedFile.name, selectedFile.size);
    } else {
        console.log("❌ No file in state! selectedFile is null");
    }

        try {
            if (editingId) {
                await productService.update(editingId, formData);
                alert("המוצר עודכן בהצלחה! ✅");
            } else {
                await productService.create(formData);
                alert("המוצר נוצר בהצלחה! 🎉");
            }
            
            closeModals();
            loadProducts();
        } catch (error) {
            console.error(error);
            alert("שגיאה בשמירה");
        }
    };

    // --- ביצוע המחיקה בפועל ---
    const performDelete = async () => {
        if (!deleteId) return;
        try {
            await productService.delete(deleteId);
            closeModals();
            loadProducts();
        } catch (error) {
            console.error(error);
            alert("שגיאה במחיקה");
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{isTrashMode ? "סל מחזור 🗑️" : "ניהול מוצרים 🍎"}</h2>
                
                <div>
                    {/* ⭐ כפתור למעבר בין מצבים */}
                    <button 
                        className={`btn ${isTrashMode ? 'btn-outline-secondary' : 'btn-warning'} me-2`} 
                        onClick={() => setIsTrashMode(!isTrashMode)}
                    >
                        {isTrashMode ? "חזור למוצרים פעילים 📋" : "הצג מוצרים מחוקים 🗑️"}
                    </button>

                    {!isTrashMode && (
                        <button className="btn btn-primary" onClick={openCreateModal}>
                            + הוסף מוצר חדש
                        </button>
                    )}
                </div>
            </div>

            {/* --- הטבלה --- */}
            <div className="table-responsive shadow bg-white rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>תמונה</th>
                            <th>שם</th>
                            <th>קטגוריה</th>
                            <th>מחיר</th>
                            <th>מלאי</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-3">
                                    {isTrashMode ? "סל המחזור ריק ♻️" : "אין מוצרים להצגה"}
                                </td>
                            </tr>
                        )}
                        {products.map(p => (
                            <tr key={p.productId} className={isTrashMode ? "table-secondary" : ""}>
                                <td>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt="" style={{width: 50, height: 50, objectFit: 'cover'}} className="rounded" />
                                    ) : (
                                        <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{width:50, height:50}}>📷</div>
                                    )}
                                </td>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>₪{p.price}</td>
                                <td>{p.stockQuantity}</td>
                                <td>
                                    {/* ⭐ לוגיקת כפתורים משתנה לפי המצב */}
                                    {isTrashMode ? (
                                        <button className="btn btn-sm btn-success" onClick={() => handleRestore(p.productId)}>
                                            שחזר ♻️
                                        </button>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(p)}>
                                                ערוך ✏️
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal(p.productId)}>
                                                מחק 🗑️
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- מודלים נשארו זהים, לכן לא שיניתי אותם בקוד זה --- */}
            {showEditModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                     {/* ... אותו תוכן של מודל עריכה ... */}
                     <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingId ? 'עריכת מוצר' : 'מוצר חדש'}</h5>
                                <button type="button" className="btn-close" onClick={closeModals}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {/* ... טופס ... */}
                                    <div className="mb-3">
                                        <label className="form-label">שם המוצר</label>
                                        <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="row">
                                        <div className="col mb-3">
                                            <label className="form-label">מחיר</label>
                                            <input type="number" className="form-control" required value={price} onChange={e => setPrice(e.target.value)} />
                                        </div>
                                        <div className="col mb-3">
                                            <label className="form-label">מלאי</label>
                                            <input type="number" className="form-control" required value={stock} onChange={e => setStock(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">קטגוריה</label>
                                        <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">תמונה</label>
                                        <input id="fileInput" type="file" className="form-control" accept="image/*" 
                                            onChange={e => e.target.files && setSelectedFile(e.target.files[0])} />
                                    </div>
                                    <div className="modal-footer px-0 pb-0">
                                        <button type="button" className="btn btn-secondary" onClick={closeModals}>ביטול</button>
                                        <button type="submit" className="btn btn-primary">{editingId ? 'שמור שינויים' : 'צור מוצר'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                     {/* ... אותו תוכן של מודל מחיקה ... */}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">אישור מחיקה</h5>
                                <button type="button" className="btn-close" onClick={closeModals}></button>
                            </div>
                            <div className="modal-body">
                                <p>האם אתה בטוח שברצונך למחוק את המוצר הזה?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModals}>ביטול</button>
                                <button type="button" className="btn btn-danger" onClick={performDelete}>כן, מחק!</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}