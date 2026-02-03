import { IsNotEmpty,IsString,IsOptional,IsNumber,Min,IsEnum,IsBoolean,maxLength,minLength } from 'class-validator'
import { ProductCategory } from '../entities/product.entity';
import { Type } from 'class-transformer';
import { Category }  from '../entities/category.entity';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsString()
    @IsOptional()
    description?:string|null

    @Type(()=>Number)
    @IsNumber()
    categoryId:number

    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    price:number

    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    stockQuantity:number
    
    @IsString()
    @IsOptional()
    imageUrl:string

    @IsOptional()
    image?: any;

    @IsBoolean()
    @IsOptional()
    IsActive:boolean|null

    @IsBoolean()
    IsDeleted:boolean = false
}
