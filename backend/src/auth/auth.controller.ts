import { Controller, Get, Post, Body, Patch, Param, Delete,UnauthorizedException,Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto'
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
 constructor(
  private readonly authService:AuthService,
  private readonly configService:ConfigService,
 ){}
 @Post('register')
 async register(@Body()UserDto:CreateUserDto){
  return this.authService.register(UserDto)
 }
 @UseGuards(LocalAuthGuard)
 @Post('login')
 async login(@Body()loginDto:LoginDto,@Request()req){
  return this.authService.login(req.user)
 }

 @Get('google')
 @UseGuards(AuthGuard('google'))
 async googleAuth(@Request()req){}

 @Get('google/callback')
 @UseGuards(AuthGuard('google'))
 async googleAuthRedirect(@Request()req, @Res()res){
   const result = await this.authService.validateGoogle(req.user)
   const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL')
   res.redirect(`${frontendUrl}/login?token=${result.access_token}`)
 }

 @UseGuards(JwtAuthGuard)
 @Get('profile')
 getProfile(@Request()req){
  return req.user
 }
 @Post('logout')
 async logout(@Request()rec){
    return {message:'Logged out successfully'}
 }
}
