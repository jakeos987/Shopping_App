import { useEffect, useState } from "react";
import { productService } from "../services/ProductService";
import { type Product } from "../features/products/types";
import toast from "react-hot-toast";
import { type Category } from "../features/products/types";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    // סל מיחזור
    const [isTrashMode, setIsTrashMode] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState<number>(0); 

    //  State לניהול המודלים 
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // נתונים לטפסים 
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // טעינת הקטגוריות מהשרת כשהדף עולה
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories");
                toast.error("שגיאה בטעינת קטגוריות");
            }
        };
        fetchCategories();
    }, []);

    // טעינת מוצרים
    useEffect(() => {
        loadProducts();
    }, [isTrashMode]);

    const loadProducts = async () => {
        try {
            let data;
            if (isTrashMode) {
                data = await productService.getDeleted();
            } else {
                data = await productService.getAll();
            }
            setProducts(data);
        } catch (error) {
            console.error(error);
            if (isTrashMode) setProducts([]);
        }
    };

    const handleRestore = async (id: number) => {
        if (!window.confirm("האם לשחזר את המוצר? ♻️")) return;
        try {
            await productService.restore(id);
            toast.success("המוצר שוחזר בהצלחה!");
            loadProducts();
        } catch (error) {
            console.error(error);
            toast.error("שגיאה בשחזור המוצר");
        }
    };

    // איפוס
    const closeModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingId(null);
        setDeleteId(null);

        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setCategoryId(0); // מאפסים את המספר
        setSelectedFile(null);

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const openCreateModal = () => {
        closeModals();
        setShowEditModal(true);
    };

    // פתיחת עריכה עם זיהוי הקטגוריה
    const openEditModal = (p: Product) => {
        closeModals();
        setEditingId(p.productId);
        setName(p.name);
        setPrice(p.price.toString());
        setStock(p.stockQuantity.toString());
        setDescription(p.description || "");

        // idכאן אנחנו לוקחים את ה
        //  של הקטגוריה מתוך המוצר
        if (p.category && p.category.categoryId) {
            setCategoryId(p.category.categoryId);
        } else {
            setCategoryId(0);
        }

        setShowEditModal(true);
    };

    const openDeleteModal = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    //  ש שליחת ה-ID לשרת
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stockQuantity', stock);
        formData.append('description', description);

        // שולחים את המספר, לא את השם
        formData.append('categoryId', categoryId.toString());

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            if (editingId) {
                await productService.update(editingId, formData);
                toast.success("המוצר עודכן בהצלחה! ✅");
            } else {
                await productService.create(formData);
                toast.success("המוצר נוצר בהצלחה! 🎉");
            }

            closeModals();
            loadProducts();
        } catch (error) {
            console.error(error);
            toast.error("שגיאה בשמירה");
        }
    };

    const performDelete = async () => {
        if (!deleteId) return;
        try {
            await productService.delete(deleteId);
            closeModals();
            loadProducts();
            toast.success("המוצר נמחק");
        } catch (error) {
            console.error(error);
            toast.error("שגיאה במחיקה");
        }
    };

    const handleAddCategory = async () => {
        const newCategoryName = window.prompt("הזן שם לקטגוריה החדשה:");
        if (!newCategoryName) return;

        try {
            const newCategory = await productService.createCategory({ name: newCategoryName });
            setCategories([...categories, newCategory]);
            setCategoryId(newCategory.categoryId);
            toast.success("קטגוריה נוספה בהצלחה!");
        } catch (error) {
            console.error(error);
            toast.error("שגיאה בהוספת קטגוריה");
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{isTrashMode ? "סל מחזור 🗑️" : "ניהול מוצרים 🍎"}</h2>

                <div>
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

            {/* הטבלה */}
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
                                        <img src={p.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded" />
                                    ) : (
                                        <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: 50, height: 50 }}>📷</div>
                                    )}
                                </td>
                                <td>{p.name}</td>
                                <td>{p.category?.name || "ללא"}</td> 
                                <td>₪{p.price}</td>
                                <td>{p.stockQuantity}</td>
                                <td>
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

            {/* מודל עריכה/יצירה  */}
            {showEditModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingId ? 'עריכת מוצר' : 'מוצר חדש'}</h5>
                                <button type="button" className="btn-close" onClick={closeModals}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">שם המוצר</label>
                                        <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">תיאור</label>
                                        <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
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
                                        <div className="input-group">
                                            <select
                                                className="form-select"
                                                value={categoryId}
                                                onChange={e => setCategoryId(Number(e.target.value))}
                                                required
                                            >
                                                <option value={0}>בחר קטגוריה...</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.categoryId} value={cat.categoryId}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="button" className="btn btn-outline-secondary" onClick={handleAddCategory}>
                                                + הוסף
                                            </button>
                                        </div>
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
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">אישור מחיקה</h5>
                                <button type="button" className="btn-close" onClick={closeModals}></button>
                            </div>
                            <div className="modal-body">
                                <p>?האם אתה בטוח שברצונך למחוק את המוצר הזה</p>
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