  import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
  import { UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto, } from './dto/update-user.dto';
  import { Role } from './entities/user.entity';
  import { Roles } from '../auth/roles/roles.decorator';
  import { RolesGuard } from '../auth/roles/roles.guard';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UseGuards } from '@nestjs/common';


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
  @Controller('users')
  @UseInterceptors(ClassSerializerInterceptor)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }

    
    @Get()
    findAll() {
      return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request()req) {
      return this.usersService.update(+id, updateUserDto,req.user);
    }
    
    @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
    @Patch(':id')
    remove(@Param('id') id: string) {
      return this.usersService.remove(+id);
    }
  }
