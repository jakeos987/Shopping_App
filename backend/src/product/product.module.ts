import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { CartItem } from '../cart/entities/cartItem.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';


@Module({
  imports: [TypeOrmModule.forFeature([Product,CartItem])
  ,CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
