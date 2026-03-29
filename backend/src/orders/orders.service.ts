import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity'
import { OrderItem } from './entities/orderItem.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cartItem.entity';
import { Product } from '../product/entities/product.entity';
import { DataSource } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Order)
    private readonly OrderRepo: Repository<Order>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>

  ) { }
  async create(userId: number, createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const cart = await this.cartRepo.findOne({
        where: {
          assignedTo: { id: userId }
        },
        relations: ['cartItems', 'cartItems.product']
      })
      if (!cart || cart.cartItems.length === 0) {
        throw new BadRequestException('cart is empty')
      }
      const orderItems: OrderItem[] = []
      let totalAmount = 0
      for (const item of cart.cartItems) {
        const product = item.product
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`not enough stock for ${product.name}`)
        }
        product.stockQuantity -= item.quantity
        await queryRunner.manager.save(product)

        const orderItem = new OrderItem()
        orderItem.product = item.product
        orderItem.price = item.product.price
        orderItem.quantity = item.quantity
        totalAmount += (orderItem.price * orderItem.quantity)
        orderItems.push(orderItem)
      }
      const order = this.OrderRepo.create({
        assignedTo: { id: userId },
        orderDate: new Date(),
        status: OrderStatus.pending,
        totalAmount: totalAmount,
        orderItems: orderItems,
        shippingAddress: createOrderDto.shippingAddress,
        city: createOrderDto.city,
        phone: createOrderDto.phone,
      })
      const savedOrder = await queryRunner.manager.save(order)
      await queryRunner.manager.delete(CartItem, { cart: { cartId: cart.cartId } })

      await queryRunner.commitTransaction()
      return savedOrder

    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }
  async findAll(userId: number) {
    return this.OrderRepo.find({
      where: {
        assignedTo: { id: userId }
      },
      relations: ['orderItems', 'orderItems.product', 'orderItems.product.category'],
      order: { orderDate: 'DESC' },
    })
  }
  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.OrderRepo.findOneBy({ orderId })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    order.status = status
    return this.OrderRepo.save(order)
  }

}