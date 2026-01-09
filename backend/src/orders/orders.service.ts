import { Injectable ,BadRequestException ,NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository } from 'typeorm';
import { Order ,OrderStatus} from './entities/order.entity'
import { OrderItem } from './entities/orderItem.entity';
import {Cart} from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cartItem.entity';


@Injectable()
export class OrdersService {
constructor(
  @InjectRepository(Order)
  private readonly OrderRepo:Repository<Order>,

  @InjectRepository(Cart)
  private readonly cartRepo:Repository<Cart>,

  @InjectRepository(CartItem)
  private readonly cartItemRepo: Repository<CartItem>

){}
async create(userId:number){
  const cart = await this.cartRepo.findOne({
    where:{
      assignedTo:{id:userId}},
      relations:['cartItems', 'cartItems.product']
  })
  if(!cart|| cart.cartItems.length === 0){
    throw new BadRequestException('cart is empty')
  }
  const orderItems: OrderItem[]=[]
  let totalAmount = 0
  for(const item of cart.cartItems){
    const orderItem = new OrderItem()
    orderItem.product = item.product
    orderItem.price = item.product.price
    orderItem.quantity = item.quantity
    totalAmount += (orderItem.price * orderItem.quantity)
    orderItems.push(orderItem)
  }
  const order = this.OrderRepo.create({
    assignedTo:{id:userId},
    orderDate: new Date(),
    status: OrderStatus.pending,
    totalAmount: totalAmount,
    orderItems: orderItems
  })
  const savedOrder = await this.OrderRepo.save(order)
  await this.cartItemRepo.delete({cart:{cartId:cart.cartId}})
  return savedOrder

}
}