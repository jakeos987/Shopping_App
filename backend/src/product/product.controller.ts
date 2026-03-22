import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UsePipes, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator'
import { ProductFilterDto } from './dto/product-filter.dto';
import { ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createCategoryDto } from './dto/create-category.dto';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    return this.productService.create(createProductDto, file);
  }

  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('category')
  createCategory(@Body() createCategory: createCategoryDto) {
    return this.productService.createCategory(createCategory)
  }

  @Get('categories')
  getAllCategories() {
    return this.productService.findAllCategories();
  }

  @Get('filter')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async filter(@Query() filterDto: ProductFilterDto) {
    return this.productService.findWithFilter(filterDto)
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('deleted')
  findDeleted() {
    return this.productService.findDeleted()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productService.findOne(+id);
  }

  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {
    return this.productService.update(+id, updateProductDto, file);
  }

  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('restore/:id')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productService.restore(id)
  }

}
