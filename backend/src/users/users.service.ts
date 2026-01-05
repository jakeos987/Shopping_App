import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotFoundException} from '@nestjs/common'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>
  ){}
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt()
    createUserDto.password = await bcrypt.hashSync(createUserDto.password,salt)
    const newUser = await this.userRepo.create({
      ...createUserDto
    })
    return await this.userRepo.save(newUser);
  }

  async findAll() {
    return await this.userRepo.find()
  }

  async findOne(email:string) {
    
    if(!email) throw new NotFoundException('user not found')
    return await this.userRepo.findOneBy({email})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({id})
    if(!user){
      throw new NotFoundException('user not found')
    }
    Object.assign(user,updateUserDto)
    this.userRepo.save(user)
    return `updated ${user.email}`
  }

  async remove(email: string) {
    const user = await this.findOne(email)
    if(!user){
      throw new NotFoundException('user not found')
    }
    await this.userRepo.remove(user)
    return `This action removed the ${email} user`;
  }
}
