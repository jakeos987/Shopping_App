import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';


@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  
  @Post('checkout')
  create(@Request()req){
    return this.ordersService.create(req.user.userId)
  }
  @Get()
  findAll(@Request()req){
    return this.ordersService.findAll(req.user.userId)
  }
}
