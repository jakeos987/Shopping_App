import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';


@Controller('orders')
  @UseInterceptors(ClassSerializerInterceptor)

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  create(@Request()req){
    return this.ordersService.create(req.user.userId)
  }
}
