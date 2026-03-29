import {create } from 'zustand';
import type { Cart } from '../features/cart/types';
import { cartService } from '../services/Cart.Service';
import { devtools } from 'zustand/middleware';

interface CartState{
    cart:Cart|null
    loading:boolean

    fetchCart:()=>void
    addToCart:(productId:number,quantity?:number)=>void
    removeFromCart:(productId:number,quantity:number)=>void
    clearCart:()=>void
}
export const useCartStore = create<CartState>()(
    devtools(
        (set, get)=>({
            cart:null,
            loading:false,
            fetchCart: async ()=>{
                set({loading:true}, false, 'fetchCart/pending');
                try{
                    const data = await cartService.getMyCart();
                    set({cart:data, loading:false}, false, 'fetchCart/success');
                }catch(error){
                    console.error('faild to fetch cart', error)
                    set({loading:false}, false, 'fetchCart/error')
                }
            },
            addToCart: async (productId: number, quantity: number = 1) => {
    try {
        const updatedCart = await cartService.addToCart(productId, quantity);
        
        set({ cart: updatedCart }, false, 'addToCart/success');
    } catch (err) {
        console.error('failed to add to cart', err);
    }
},
            removeFromCart: async (productId: number, quantity: number) => {
    const currentCart = get().cart;
    if (currentCart) {
        const optimisticItems = currentCart.cartItems.map(item => {
            if (item.product.productId === productId) {
                return { ...item, quantity: item.quantity - quantity };
            }
            return item;
        }).filter(item => item.quantity > 0); 

        set({ 
            cart: { ...currentCart, cartItems: optimisticItems } 
        }, false, 'removeFromCart/optimistic');
    }

    try {
        const serverCart = await cartService.removeFromCart(productId, quantity);
        
        set({ cart: serverCart }, false, 'removeFromCart/success');
    } catch (err) {
        console.error('failed to remove from cart', err);
        get().fetchCart(); 
    }
},
            clearCart: ()=>{
                set({cart:null}, false, 'clearCart')
            }
        }),
        {name:'cart-store'}
    )
)