import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { CartItem } from '../cart/entities/cartItem.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Product,CartItem])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
