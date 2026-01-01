import {Entity, PrimaryGeneratedColumn, Column,OneToMany,CreateDateColumn} from "typeorm";
import {Order} from '../../orders/entities/order.entity'

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

    
    
    // @DeleteDateColumn()
    // deletedAt:Date | null
}
