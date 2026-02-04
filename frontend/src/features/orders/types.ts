import { type Product } from "../products/types";
import { type User } from "../user/types";

export enum OrderStatus {
    pending = "PENDING",
    shipped = "SHIPPED",
    delivered = "DELIVERED",
    cancelled = "CANCELLED"
}

export interface OrderItem {
    orderItemId: number; 
    quantity: number;
    price: number;       
    product?: Product;   
    productName?: string; 
}

export interface Order {
    orderId: number;
    orderDate: string;  
    totalAmount: number;
    status: OrderStatus;
    
    user?: User;
    address: string;
    city: string;
    phone: string;
    
    orderItems: OrderItem[]; 
}
