import { Injectable,UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService:UsersService,
    private readonly jwtService: JwtService
  ){}
  async validateUser(email:string,pass:string){
    const user = await this.userService.findOne(email)
    if(user && (await bcrypt.compare(pass,user.password))){
      const {password,...result} = user
      return result
    }
    return null
  }
  async login(user:any){
    const payload= {email:user.email,sub:user.id,role:user.role}
    return{
      access_token:this.jwtService.sign(payload)
    }
  }
  async register(userDto: CreateUserDto){
    const newUser = await this.userService.create(userDto)

    const payload = {sub:newUser.id,email:newUser.email,role:newUser.role}
    return {
      access_token:this.jwtService.sign(payload),
      user:{id: newUser.id,email:newUser.email}
    }
  }
}
