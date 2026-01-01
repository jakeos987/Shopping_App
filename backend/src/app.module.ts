import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/Typeorm';
import {User} from './users/entities/user.entity';
import { OrdersModule } from './orders/orders.module';
import {Order } from './orders/entities/order.entity'

@Module({
  imports: [ UsersModule,OrdersModule,ConfigModule.forRoot({
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
  database:configService.get<string>('DB_DATABACE'),
  entities:[User,Order],
  synchronize:true,
  }),
}),
OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
