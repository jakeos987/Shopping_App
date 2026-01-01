import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('OrderItems')
export class OrderItem {
    @PrimaryGeneratedColumn()
    OrderItemId:number

    @Column()
    quantity:number

    @Column()
    price:number

    @ManyToOne(()=>Order,(order)=>order.orderId)
    order:Order

    @ManyToOne(()=>Product,(product)=>product.productId)
    product:Product
}
