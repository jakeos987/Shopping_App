import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/Typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Cart,CartItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
