import { Entity, PrimaryGeneratedColumn, ManyToOne,Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('CartItem')
export class CartItem{

@ManyToOne(()=>Cart,(cart)=>cart.cartItems)
cart:Cart

}