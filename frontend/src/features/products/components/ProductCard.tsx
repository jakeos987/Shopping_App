import { type Product } from "../types";
import { useAuthStore } from '../../../store/UseAuth.store';
import { useNavigate } from "react-router-dom";

interface Props {
    product:Product
}
export const ProductCard = ({product}:Props)=>{
    const token = useAuthStore((state)=> state.token)
    const isActivated= !!token
    const navigate = useNavigate()
    const handlerSubmit=()=>{//////////////////////////////////////
        alert(`הוספת את ${product.name} לסל`)
    }
    return(
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
                <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    className="card-img-top"
                    alt={product.name}
                    style={{height: '200px', objectFit: 'cover'}}
                />
                <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">
                קטגוריה:{product.category}
                </p>
                <div className="mt-auto d-flex justify-content-between align-item-center">
                    <span className="h5 mb-0">₪{product.price}</span>
                    {isActivated?(
                        <button 
                        className="btn btn-outline-primary"
                        onClick={handlerSubmit}///////////////////////////////
                        disabled={product.stockQuantity===0}
                        >
                        {product.stockQuantity > 0 ? "🛒הוסף לסל🛒" :"אזל המלאי"}
                        </button>
                    ):(
                        <button 
                        className="btn btn-secondary"
                        onClick={()=> navigate('/login')}
                        >
                        התחבר בשביל לקנות
                        </button>
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}