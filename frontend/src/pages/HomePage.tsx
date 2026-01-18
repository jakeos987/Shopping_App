import { useEffect, useState } from "react";
import {type Product } from "../features/products/types";
import {productService } from '../services/ProductService';
import { ProductCard } from "../features/products/components/ProductCard";
import { useAuthStore } from "../store/UseAuth.store";

export default function HomePage(){
    const [product, setProduct ] = useState<Product[]>([]);
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState('')
    const user = useAuthStore((state)=>state.user)

    useEffect(()=>{
        const fetchProduct =async ()=>{
            try{
                const data =await productService.getAll()
                setProduct(data)
            }catch(err){
                console.error(err)
                setError('לא הצלחנו לטעון את המוצרים, נסה שוב מאוחר יותר')
            }finally{
                setLoading(false)
            }
        }
        fetchProduct()
    },[])
    return(
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1> החנות שלנו</h1>
                {user && <p className="lead">{user.firstName} שלום</p>}
                {!user && <p className="text-muted">התחבר כדי לקנות</p>}
            </div>
            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">loading...</span>
                    </div>
                </div>
            )}
            {error &&<div className="alert alert-danger text-center">{error}</div>}
            {!loading && !error && (
                <div className="row">
                    {product.map((product)=>(
                        <ProductCard key={product.productId} product={product}/>
                    ))}
                    {product.length ===0 && (
                        <div className="text-center w-100">
                            <h3>אין מוצרים כרגע בחנות</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}