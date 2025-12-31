import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeOrm'
import {User} from './users/entities/user.entity'

@Module({
  imports: [ UsersModule,ConfigModule.forRoot({
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
  entities:[User],
  synchronize:true,
  }),
}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
