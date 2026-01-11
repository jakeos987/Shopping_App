import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cartItem.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItem,Cart,CartItem,Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
