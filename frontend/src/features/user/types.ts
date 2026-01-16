import type { Order } from "../orders/types"
import type { Cart } from '../cart/types'

export interface User{
    id:number
    email:string
    role:UserRole
    firstName:string
    lastName:string
    createdAt:string
    orders?:Order[]
    cart?:Cart
}
export interface UserRole{
    role:"USER"|"ADMIN"
}
export interface CreateUserDTO{
    email:string
    password:string
    firstName:string
    lastName:string
}
export interface UpdateUserDTO{
    email?:string
    password?:string
    firstName?:string
    lastName?:string
    role?:UserRole
}
