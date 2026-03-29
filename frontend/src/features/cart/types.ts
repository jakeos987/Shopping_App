import type { Product } from "../products/types"

export interface CartItem{
    cartItemId:number
    quantity:number
    product:Product
}
export interface Cart{
    cartId:number
    cartItems:CartItem[]
    totalPrice:number
}