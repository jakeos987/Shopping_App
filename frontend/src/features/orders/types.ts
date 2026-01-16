import {type Product } from "../products/types"

export interface Order{
    orderId:number
    createdAt:string
    total:number
    orderItems:OrderItem[]
}

export interface OrderItem{
    orderItemId:number
    quantity:number
    price:number
    product:Product
}