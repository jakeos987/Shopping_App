import { IsNotEmpty,IsString,IsOptional,IsNumber,IsBoolean} from 'class-validator'
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsString()
    @IsOptional()
    description:string|null

    @IsString()
    @IsNotEmpty()
    category:string

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
