import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ProductService {
constructor(
  @InjectRepository(Product)
  private readonly productRepo:Repository<Product>
){}

 async create(createProduct: CreateProductDto) {
    const product = this.productRepo.create(createProduct)
    return this.productRepo.save(product) 
  }
async findAll(){
  return this.productRepo.find()
}
 
}
