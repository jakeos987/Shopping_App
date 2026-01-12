import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';
import { ProductCategory } from './entities/product.entity';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator'


@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  
  @Get('serch')
  async serch(
  @Query('name')name?:string,
  @Query('category')category?:ProductCategory,
  @Query('id')id?:number) {
    return this.productService.findOneByNameOrCategoryOrId(name,category,id)
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
  // @UseGuards(JwtAuthGuard,Roles(Role.admin))
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
