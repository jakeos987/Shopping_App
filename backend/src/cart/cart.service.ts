import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
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
  private calculateTotalPrice(cart:Cart):number{
    if(!cart.cartItems) return 0
    return cart.cartItems.reduce((total, item)=>{
      return total +(item.quantity *item.product.price)
    },0)
  }


  async createOrGetCart(userId: number):Promise<Cart>{
    let cart = await this.cartRepo.findOne({
      where:{ assignedTo:{id:userId}},
        relations:['cartItems', 'cartItems.product'],
    })
    if(!cart){
      cart = this.cartRepo.create({
        assignedTo:{id:userId} as User,
        cartItems:[]
      })
      await this.cartRepo.save(cart)
    }
    cart.totalPrice=this.calculateTotalPrice(cart)
    return cart
  }
async addToCart(userId:number,productId:number,quantity:number){
  const cart = await this.createOrGetCart(userId)
  const existingItem = cart.cartItems.find((item)=>item.product.productId === productId)
  if(existingItem){
    existingItem.quantity += quantity
    await this.cartItemRepo.save(existingItem)
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
    await this.cartItemRepo.save(newItem)  
  }
  return this.createOrGetCart(userId)
}
async removeFromCart(userId: number, productId: number, quantityToRemove: number) {
    
    const qty = Number(quantityToRemove);
    const pId = Number(productId);

    const cart = await this.createOrGetCart(userId);

    const existingItem = await this.cartItemRepo.findOne({
      where: {
        cart: { cartId: cart.cartId },      
        product: { productId: pId }  
      },
      relations: ['product'] 
    });

    if (!existingItem) {
        
        const allItems = await this.cartItemRepo.find({ 
            where: { cart: { cartId: cart.cartId } }, 
            relations: ['product'] 
        });        
        throw new BadRequestException(`המוצר לא נמצא בעגלה, נסה לרענן את העמוד`);
    }    
    existingItem.quantity -= qty;

    if (existingItem.quantity <= 0) {
        await this.cartItemRepo.remove(existingItem);
    } else {
        await this.cartItemRepo.save(existingItem);
    }
    return this.createOrGetCart(userId);
  }
}
