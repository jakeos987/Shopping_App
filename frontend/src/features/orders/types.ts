import { type Product } from "../products/types";
import { type User } from "../user/types";

export enum OrderStatus {
    pending = "PENDING",
    shipped = "SHIPPED",
    delivered = "DELIVERED",
    cancelled = "CANCELLED"
}

export interface OrderItem {
    orderItemId: number; // או id, תלוי בשרת. בדרך כלל ב-NestJS זה id או orderItemId
    quantity: number;
    price: number;       // ⭐ תיקון: שונה מ-priceAtPurchase ל-price
    product?: Product;   // המוצר המלא (אם ה-relation נטען)
    productName?: string; // גיבוי אם אין אובייקט מוצר מלא
}

export interface Order {
    orderId: number;
    orderDate: string;   // ⭐ תיקון: שונה מ-createdAt ל-orderDate
    totalAmount: number;
    status: OrderStatus;
    
    user?: User;
    address: string;
    city: string;
    phone: string;
    
    orderItems: OrderItem[]; // ⭐ תיקון: שונה מ-items ל-orderItems
}
//////////////////////////////////////////////////////////////////////////////