import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

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
async update(id:number,updateProductDto:UpdateProductDto){
  const product = await this.productRepo.findOneBy({productId:id})
  if(!product){
    throw new NotFoundException(`Product with ID ${id} not found`)
  }
  Object.assign(product,updateProductDto)
  return this.productRepo.save(product)
}
async remove(id:number){
  const result = await this.productRepo.delete(id)
  if(result.affected === 0){
    throw new NotFoundException(`Product with ID ${id} not found`)
  }
  return {message:`Product with ID ${id} deleted successfully`}
}
}