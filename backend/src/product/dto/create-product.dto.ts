import { IsNotEmpty,IsString,IsOptional,IsNumber,IsBoolean,maxLength,minLength } from 'class-validator'
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsString()
    @IsOptional()
    description:string|null

    @IsString()
    @IsNotEmpty()
    category:ProductCategory

    @IsNumber()
    @IsNotEmpty()
    price:number

    @IsNumber()
    @IsNotEmpty()
    stock:number
    
    @IsNotEmpty()
    @IsString()
    imageUrl:string

    @IsBoolean()
    IsActive:boolean
}
