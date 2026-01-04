import { Controller, Get, Post, Body, Patch, Param, Delete,UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

@Controller('auth')
export class AuthController {
 constructor(
  private readonly authService:AuthService,
  private readonly userService:UsersService,
 ){}
 @Post('register')
 async register(@Body()UserDto:CreateUserDto){
  return this.userService.create(UserDto)
 }
 @Post('login')
 async login(@Body()Body){
  const user = await this.authService.validateUser(Body.email,Body.password)
  if(!user){
    throw new UnauthorizedException('invalid credentialls')
  }
  return this.authService.login(user)
 }
}
