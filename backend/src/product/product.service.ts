import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { ProductCategory } from './entities/product.entity';

@Injectable()
export class ProductService {
constructor(
  @InjectRepository(Product)
  private readonly productRepo:Repository<Product>,

  @InjectRepository(CartItem)
  private readonly cartItemRepo:Repository<CartItem>
){}

 async create(createProduct: CreateProductDto) {
    const exitingProduct = await this.productRepo.findOne({
      where:{
        name:createProduct.name,
    }})
    if(exitingProduct){
      exitingProduct.stockQuantity += createProduct.stockQuantity
      return this.productRepo.save(exitingProduct) 
      
    }const newProduct = this.productRepo.create(createProduct)
    return this.productRepo.save(newProduct)
    
  }
async findAll(){
  return this.productRepo.find()
}
async findOneByNameOrCategoryOrId(name?:string,category?:ProductCategory,id?:number){
  const product = await this.productRepo.find({
    where:[
      {name},
      {category},
      {productId:id}
    ]
  })
  return product
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
  const result = await this.productRepo.softDelete(id)
  if(result.affected === 0){
    throw new NotFoundException(`Product with ID ${id} not found`)
  }
  await this.cartItemRepo.delete({product:{productId:id}})
  return {message:`Product with ID ${id} deleted successfully`}
}
}