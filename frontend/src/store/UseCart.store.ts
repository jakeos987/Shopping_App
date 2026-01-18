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
            addToCart: async (productId:number, quantity:number=1)=>{
                set({loading:true}, false, 'addToCart/pending')
                try{
                    await cartService.addToCart(productId,quantity)
                    await get().fetchCart()
                    set({loading:false}, false, 'addToCart/success')
                }catch(err){
                    console.error('failed to add to cart',err)
                    set({loading:false}, false, 'addToCart/error')
                    throw err
                }
            },
            removeFromCart: async (productId:number, quantity:number)=>{
                set({loading:true}, false, 'removeFromCart/pending')
                try{
                    await cartService.removeFromCart(quantity,productId)
                    await get().fetchCart()
                    set({loading:false}, false, 'removeFromCart/success')
                }catch(err){
                    console.error('falied to remove from cart', err)
                    set({loading:false}, false, 'removeFromCart/error')
                }
            },
            clearCart: ()=>{
                set({cart:null}, false, 'clearCart')
            }
        }),
        {name:'cart-store'}
    )
)