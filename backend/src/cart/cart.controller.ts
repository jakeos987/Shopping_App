import { Controller, Get, Post, Body, Patch,UseGuards,Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
@Controller('cart')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
    constructor(private readonly cartService:CartService){}
    
    @Post('add')
    async AddToCart(@Request()req,@Body()addToCartDto:AddToCartDto){
        const userId = await req.user.userId
        return this.cartService.addToCart(
            userId,
            addToCartDto.productId,
            addToCartDto.quantity
        )
    }
    @Get()
    async getMyCart(@Request()req){
        const userId = await req.user.userId
        return this.cartService.createOrGetCart(userId)
    }
    @Patch('remove')
  removeFromCart(@Request() req, @Body() body: any) {
    const productId = Number(body.productId); 
    const quantity = Number(body.quantityToRemove || body.quantity);
    if (isNaN(productId) || isNaN(quantity)) {
        throw new BadRequestException('ID או כמות לא תקינים');
    }

    return this.cartService.removeFromCart(
        req.user.userId, 
        productId,
        quantity   
    );
  }
}