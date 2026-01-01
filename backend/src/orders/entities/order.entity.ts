import { User } from 'src/users/entities/user.entity'
import { Entity,PrimaryGeneratedColumn,JoinTable,Column,ManyToOne,OneToMany,CreateDateColumn } from 'typeorm'

enum OrderStatus{
    pending="PENDING",
    inProgrss="IN_PROGRESS",
    completed="COMPLETED",
}

@Entity('Orders')
export class Order{
    @PrimaryGeneratedColumn()
    orderId:number


    @CreateDateColumn()
    orderDate:Date

    @Column()
    totalAmount:number

    @Column()
    status:OrderStatus

    @ManyToOne(()=>User,(user)=>user.orders)
    assignedTo:User
}