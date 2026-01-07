import { IsNotEmpty,IsString,IsOptional,IsNumber,Min,IsEnum,IsBoolean,maxLength,minLength } from 'class-validator'
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsString()
    @IsOptional()
    description:string|null

    @IsEnum(ProductCategory)
    category:ProductCategory

    @IsNumber()
    @Min(0)
    price:number

    @IsNumber()
    @Min(0)
    stockQuantity:number
    
    @IsString()
    @IsOptional()
    imageUrl:string

    @IsBoolean()
    @IsOptional()
    IsActive:boolean|null
}
