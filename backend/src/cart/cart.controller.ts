import { Controller, Get, Post, Body, Patch,UseGuards,Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
constructor(private readonly cartService:CartService){}
    @Post('add')
    
    async AddToCart(@Request()req,@Body()addToCartDto:AddToCartDto){
        const userId = req.user.userId
        return this.cartService.addToCart(
            userId,
            addToCartDto.productId,
            addToCartDto.quantity
        )
    }
    @Get()
    async getMyCart(@Request()req){
        const userId = req.user.userId
        return this.cartService.createOrGetCart(userId)
    }
}

  


  

