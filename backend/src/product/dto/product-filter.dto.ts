import { IsOptional, IsString, IsNumber, Min} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../entities/product.entity';

export class ProductFilterDto{
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    categoryId:number

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    minPrice?:number;

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    maxPrice:number;

}