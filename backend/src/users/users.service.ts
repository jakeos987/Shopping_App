import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from './entities/user.entity'
import { InjectRepository } from '@nestjs/Typeorm'
import { Repository } from 'typeorm'
import { NotFoundException} from '@nestjs/common'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>
  ){}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    this.userRepo.save(user)
    return `addeed ${user.id}`;
  }

  async findAll() {
    return await this.userRepo.find()
  }

  async findOne(id: number) {
    return await this.userRepo.findOneBy({id})
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

  async remove(id: number) {
    const user = await this.findOne(id)
    if(!user){
      throw new NotFoundException('user not found')
    }
    await this.userRepo.remove(user)
    return `This action removed the ${id} user`;
  }
}
