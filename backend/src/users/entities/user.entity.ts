import {Entity, PrimaryGeneratedColumn, Column,OneToMany,CreateDateColumn} from "typeorm";
import { Exclude } from 'class-transformer';
import {Order} from '../../orders/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';

export enum Role{
    admin="ADMIN",
    user="USER"
}

@Entity("User")
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column()
    email:string

    @Column()
    @Exclude()
    password:string

    @Column({
        type:"enum",
        enum:Role,
        default:Role.user
    })
    role:Role

    @CreateDateColumn()
    createdAt:Date
    
    @OneToMany(()=>Order,(order)=>order.assignedTo)
    orders:Order[]

    @OneToMany(()=>Cart,(cart)=>cart.assignedTo)
    carts:Cart[]
}
