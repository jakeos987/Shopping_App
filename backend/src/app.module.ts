import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/Typeorm';
import {User} from './users/entities/user.entity';
import { OrdersModule } from './orders/orders.module';
import {Order } from './orders/entities/order.entity'
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { OrderItem } from './orders/entities/orderItem.entity';

@Module({
  imports: [ UsersModule,OrdersModule,ProductModule,ConfigModule.forRoot({
    isGlobal:true,
  }),
TypeOrmModule.forRootAsync({
imports:[ConfigModule],
inject:[ConfigService],
useFactory:(configService:ConfigService)=>({
  type:"postgres",
  host:configService.get<string>('DB_HOST'),
  port:configService.get<number>('DB_PORT'),
  username:configService.get<string>('DB_USERNAME'),
  password:configService.get<string>('DB_PASSWORD'),
  database:configService.get<string>('DB_DATABASE'),
  entities:[User,Order,Product,OrderItem],
  synchronize:true,
  }),
}),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
