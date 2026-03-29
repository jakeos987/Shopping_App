import { api } from './api';
import type { Cart } from '../features/cart/types';

export const cartService ={
    async getMyCart(){
        const res = await api.get<Cart>('/cart')
        return res.data
    },
    async addToCart(productId:number, quantity:number=1){
        const res = await api.post('/cart/add',{
            productId,
            quantity
        });
        return res.data
    },
   async removeFromCart(productId: number, quantity: number) {
        const res = await api.patch('/cart/remove', {
            productId: productId,          
            quantityToRemove: quantity     
        });
        return res.data;
    },

}