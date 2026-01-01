import { Entity,PrimaryGeneratedColumn,CreateDateColumn,OneToMany,ManyToOne} from 'typeorm';
import { User} from '../../users/entities/user.entity';
import { CartItem } from './cartItem.entity'


@Entity('Cart')
export class Cart {
    @PrimaryGeneratedColumn()
    cartId:number

    @CreateDateColumn()
    createdAt:Date

    @ManyToOne(()=>User,(user)=>user.id)
    assignedTo:User

    @OneToMany(()=>CartItem,(cartItem)=>cartItem.cart)
    cartItems:CartItem[]
}