import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Role } from 'src/users/entities/user.entity';
import { OrderStatus } from './entities/order.entity';
import { Roles } from '../auth/roles/roles.decorator'

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('checkout')
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto)
  }
  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user.userId)
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(+id, status)
  }
}
