import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { OrderItem } from '../../orders/entities/orderItem.entity';
import { CartItem } from '../../cart/entities/cartItem.entity';
import { Category } from './category.entity'

export enum ProductCategory {
    electronics = "ELECTRONICS",
    clothing = "CLOTHING",
    books = "BOOKS",
    boardGames = "BOARD_GAMES",
    beverages = "BEVERAGES",
    gaming = "GAMING"
}

@Entity('Products')
export class Product {
    @PrimaryGeneratedColumn()
    productId: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 11, scale: 2 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ default: 1 })
    stockQuantity: number;

    @Column({ type: 'varchar', nullable: true })
    imageUrl: string | null;




    @DeleteDateColumn()
    deletedAt: Date;


    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @OneToMany(() => CartItem, (cartitem) => cartitem.product)
    cartItems: CartItem[];

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

}