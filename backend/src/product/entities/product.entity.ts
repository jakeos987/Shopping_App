import { Entity, PrimaryGeneratedColumn,Column,OneToMany,DeleteDateColumn} from 'typeorm';
import { Exclude } from 'class-transformer';
import { OrderItem } from '../../orders/entities/orderItem.entity';
import { CartItem } from '../../cart/entities/cartItem.entity';

export enum ProductCategory{
    electronics="ELECTRONICS",
    clothing="CLOTHING",
    books="BOOKS",
    boardGames="BOARD_GAMES",
    beverages="BEVERAGES",
    gaming = "GAMING"
}

@Entity('Products')
export class Product {
    @PrimaryGeneratedColumn()
    productId:number;

    @Column()
    name:string;

    @Column()
    category:ProductCategory;

    @Column('decimal',{precision:11,scale:2})
    price:number;

    @Column({default:1})
    stockQuantity:number;

    @Column({type:'varchar',nullable:true})
    imageUrl:string | null;


    @Column('boolean',{default:false})
    isActive:boolean;

    @DeleteDateColumn()
    // @Exclude()
    deletedAt: Date;
    

    @OneToMany(()=>OrderItem,(orderItem)=>orderItem.product)
    orderItems:OrderItem[];

    @OneToMany(()=>CartItem,(cartitem)=>cartitem.product)
    cartItems:CartItem[];
}