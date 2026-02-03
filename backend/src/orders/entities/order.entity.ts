import { User } from '../../users/entities/user.entity';
import { OrderItem } from './orderItem.entity';
import { Entity, PrimaryGeneratedColumn, JoinTable, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer';

export enum OrderStatus {
    pending = "PENDING",
    shipped = "SHIPPED",
    delivered = "DELIVERED",
    cancelled = "CANCELLED"
}

@Entity('Orders')
export class Order {
    @PrimaryGeneratedColumn()
    orderId: number

    @CreateDateColumn()
    orderDate: Date

    @Column('decimal', { precision: 11, scale: 2 })
    totalAmount: number

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.pending
    })
    status: OrderStatus

    @Column({ nullable: true })
    shippingAddress: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    phone: string;


    @ManyToOne(() => User, (user) => user.orders)
    assignedTo: User

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems: OrderItem[]

}