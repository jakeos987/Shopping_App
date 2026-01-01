import { Entity, PrimaryGeneratedColumn, ManyToOne,Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('CartItem')
export class CartItem{

@PrimaryGeneratedColumn()
cartItemId:number

@Column()
quantity:number

@ManyToOne(()=>Cart,(cart)=>cart.cartItems)
cart:Cart

@ManyToOne(()=>Product,(product)=>product.cartItems)
product:Product
}