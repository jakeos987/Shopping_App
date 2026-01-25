import { useState, useEffect } from "react";
import { type Product } from "../features/products/types";
import { productService } from "../services/ProductService";

export default function AdminProductPage(){
    const [products, setProducts ] = useState<Product[]>([])
    const [editingId, setEditingId ] = useState<number | null>(null)

    const [editForm, setEditForm ] = useState({name:'', price: 0, stockQuantity: 0, imageUrl: ''})
    useEffect(()=>{
        loadProducts()
    },[])
    const loadProducts = async()=>{
        try{
            const data = await productService.getAll()
            setProducts(data)
        }catch(err){
            console.error("failed to load [rpducts",err)
        }
    }
    const startEdit = (product:Product)=>{
        setEditingId(product.productId)
        setEditForm({
            name: product.name,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl || ""
        })
    }
    const cancelEdit= ()=>{
        setEditingId(null)
        setEditForm({name:'', price: 0, stockQuantity: 0, imageUrl: ''})
    }
    const handleSave= async(productId:number)=>{
        try{
            await productService.update(productId, editForm)
            setProducts(products.map(p=> p.productId === productId ? {...p, ...editForm} :p))
            setEditingId(null)
            alert('המוצר עודכן בהבצלחה')
        }catch(err){
            console.error(err)
            console.error('שגיאה בעדכון המוצר', err)
        }
    }
    const handleDelete = async(id:number)=>{
        if(!window.confirm('?אתה בטוח שאתה רוצה למחוק את המוצר'))return
        try{
            await productService.delete(id)
            setProducts(products.filter(p=> p.productId !== id))
        }catch(err){
            console.error(err)
            alert('שגיאה במחיקה של המוצר')
        }
    }
    return(
        <div className="container mt-5">
            <h2 className="mb-4">ניהול מוצרים (Admin) 🛠️</h2>
            
            <div className="table-responsive shadow bg-white rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>תמונה</th>
                            <th>ID</th>
                            <th>שם מוצר</th>
                            <th>מחיר (₪)</th>
                            <th>מלאי</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const isEditing = editingId === product.productId;

                            return (
                                <tr key={product.productId}>
                                    <td>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm"
                                                placeholder="URL תמונה"
                                                value={editForm.imageUrl}
                                                onChange={e => setEditForm({...editForm, imageUrl: e.target.value})}
                                            />
                                        ) : (
                                            <img 
                                                src={product.imageUrl} 
                                                alt="" 
                                                style={{width: '50px', height: '50px', objectFit: 'cover'}} 
                                                className="rounded"
                                            />
                                        )}
                                    </td>

                                    <td>{product.productId}</td>

                                    <td>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm"
                                                value={editForm.name}
                                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                            />
                                        ) : (
                                            <span className="fw-bold">{product.name}</span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input 
                                                type="number" 
                                                className="form-control form-control-sm"
                                                style={{width: '80px'}}
                                                value={editForm.price}
                                                onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                                            />
                                        ) : product.price}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input 
                                                type="number" 
                                                className="form-control form-control-sm"
                                                style={{width: '80px'}}
                                                value={editForm.stockQuantity}
                                                onChange={e => setEditForm({...editForm, stockQuantity: Number(e.target.value)})}
                                            />
                                        ) : (
                                            <span className={product.stockQuantity < 5 ? "text-danger fw-bold" : "text-success"}>
                                                {product.stockQuantity}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-success btn-sm" onClick={() => handleSave(product.productId)}>שמור</button>
                                                <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>ביטול</button>
                                            </div>
                                        ) : (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-primary btn-sm" onClick={() => startEdit(product)}>ערוך ✏️</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.productId)}>מחק 🗑️</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}