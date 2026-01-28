import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UsePipes, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';
import { ProductCategory } from './entities/product.entity';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator'
import { ProductFilterDto } from './dto/product-filter.dto';
import { ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() createProductDto: CreateProductDto, @UploadedFile()file: Express.Multer.File) {
    console.log('🔍 Controller Check - File object:', file);
    return this.productService.create(createProductDto, file);
  }
@Get('filter')
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  async filter(@Query()filterDto: ProductFilterDto){
    return this.productService.findWithFilter(filterDto)
  }



  @Get()
  findAll() {
    return this.productService.findAll();
  }
//  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
  @Get('deleted')
  findDeleted(){
    return this.productService.findDeleted()
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: string) {
    return this.productService.findOne(+id);
  }


  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@UploadedFile() file: Express.Multer.File) {
    return this.productService.update(+id, updateProductDto, file);
  }
  
  // @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
  // @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.admin)
  @Patch('restore/:id')
  restore(@Param('id',ParseIntPipe)id:number){
    return this.productService.restore(id)
  }
 
}
