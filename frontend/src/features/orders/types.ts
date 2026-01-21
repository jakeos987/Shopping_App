import {type Product } from "../products/types"

export enum OrderStatus{
    pending="PENDING",
    shipped="SHIPPED",
    delivered="DELIVERED",
    cancelled="CANCELLED"
}

export interface Order{
    orderId:number
    createdAt:string
    totalAmount:number
    orderStatus:OrderStatus
    orderDate:Date
    orderItems:OrderItem[]
}

export interface OrderItem{
    orderItemId:number
    quantity:number
    price:number
    product:Product
}