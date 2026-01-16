import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, LessThanOrEqual, MoreThanOrEqual,Between } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CartItem } from '../cart/entities/cartItem.entity';
import { ProductCategory } from './entities/product.entity';
import { ProductFilterDto } from './dto/product-filter.dto';

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
async findOne(id:number){
  const product = await this.productRepo.findOne({where:{productId:id}})
  if(!product){
    throw new NotFoundException(`Product with ID ${id} not found`)
  }
  return product
}
async findByNameOrCategoryOrId(name?:string,category?:ProductCategory,id?:number){
  const whereCondition:any[] = []
  if(name){
    whereCondition.push({name})
  }
  if(category){
    whereCondition.push({category})
  }
  if(id){
    whereCondition.push({productId:id})
  
  }
  return await this.productRepo.find({
    where:whereCondition
  })
  }
  async findWithFilter(filterDto: ProductFilterDto){
    const {search, category,minPrice,maxPrice } = filterDto
    let priceCondition = {}

    if(minPrice && maxPrice){
      priceCondition = {price: Between(minPrice,maxPrice)}
    }else if(minPrice){
      priceCondition = {price: MoreThanOrEqual(minPrice)}
    }else if(maxPrice){
      priceCondition = {price: LessThanOrEqual(maxPrice)}
    }
    const whereCondition:any[] = []
    if(search){
      whereCondition.push({name: ILike(`%${search}%`),
    ...priceCondition})
    }
    if(category){
      whereCondition.push({
        category:category,
        ...priceCondition
      })
    }
    if(!search && !category && Object.keys(priceCondition).length >0){
      whereCondition.push(priceCondition)
    }
    if(whereCondition.length === 0){
      return {message:`there is no product found`}
    }
    return await this.productRepo.find({
      where:whereCondition,
      order:{price:'ASC'}
    })

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
async restore(id:number){
  const result = await this.productRepo.restore(id)
  if(result.affected === 0){
    throw new NotFoundException(`product with ID ${id} not found`)
  }
  return this.productRepo.findOne({where:{productId:id}})
}

}
