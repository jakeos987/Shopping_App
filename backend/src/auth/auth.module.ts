import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport'
import { ConfigModule,ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy'
import { GoogleStrategy } from './google/google.strategy';



@Module({
  imports: [ UsersModule,PassportModule,JwtModule.registerAsync({
    imports:[ConfigModule],
    useFactory:async(configService:ConfigService)=>({
      secret:configService.get<string>('SECRET_KEY'),
      signOptions:{
        expiresIn:'8h'
      },
    }),
    inject:[ConfigService],
  }),
],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy, GoogleStrategy],
  exports:[AuthService],
})
export class AuthModule {}
