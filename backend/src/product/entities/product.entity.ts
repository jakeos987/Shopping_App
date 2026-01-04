import { Entity, PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';
import { OrderItem } from '../../orders/entities/orderItem.entity';
import { CartItem } from '../../cart/entities/cartItem.entity';

export enum ProductCategory{
    electronics="ELECTRONICS",
    clothing="CLOTHNG",
    books="BOOKS",
    boardGames="BOARD_GAMES",
    bevrages="BEVRAGES",
}

@Entity('Products')
export class Product {
    @PrimaryGeneratedColumn()
    productId:number;

    @Column()
    name:string;

    @Column()
    category:ProductCategory;

    @Column()
    price:number;

    @Column({default:1})
    stockQuantity:number;

    @Column()
    imageUrl:string;

    @Column('boolean',{default:false})
    isActive:boolean;

    @OneToMany(()=>OrderItem,(orderItem)=>orderItem.order)
    orderItems:OrderItem[];

    @OneToMany(()=>CartItem,(cartitem)=>cartitem.product)
    cartItems:CartItem[];
}