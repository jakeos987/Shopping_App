import { Controller, Get, Post, Body, Patch, Param, Delete,UnauthorizedException,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
 constructor(
  private readonly authService:AuthService,
  private readonly userService:UsersService,
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
