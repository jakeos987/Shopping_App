import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/entities/product.entity';



@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo:Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepo:Repository<Product>
  ){}
  async createOrGetCart(userId: number):Promise<Cart>{
    let cart = await this.cartRepo.findOne({
      where:{ assignedTo:{id:userId}},
        relations:['cartItems', 'cartItems.product'],
        // withDeleted:true
    })
    if(!cart){
      cart = this.cartRepo.create({
        assignedTo:{id:userId} as User,
        cartItems:[]
      })
      await this.cartRepo.save(cart)
    }
    return cart
  }
async addToCart(userId:number,productId:number,quantity:number){
  const cart = await this.createOrGetCart(userId)
  const existingItem = cart.cartItems.find((item)=>item.product.productId === productId)
  if(existingItem){
    existingItem.quantity += quantity
    return this.cartItemRepo.save(existingItem)
  }else{
    const product = await this.productRepo.findOneBy({productId})
    if(!product){
      throw new NotFoundException('Product not found')
    }
    const newItem:CartItem = this.cartItemRepo.create({
      cart:cart,
      product:product,
      quantity:quantity,
    })
    return this.cartItemRepo.save(newItem)
  }
}
}
