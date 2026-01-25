import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Role, User} from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotFoundException} from '@nestjs/common'
import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';

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
    const users = await this.userRepo.find();
  return users;
  }

  async findOne(id: number) {
    if (!id) throw new NotFoundException('User ID is required');
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.userRepo.findOneBy({id})
    if(!user){
      throw new NotFoundException('user not found')
    }
    Object.assign(user,updateUserDto)
    if (updateUserDto.role && currentUser.role !== Role.admin) {
        throw new ForbiddenException("רק מנהל מערכת יכול לשנות תפקידי משתמשים!");
    }
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
