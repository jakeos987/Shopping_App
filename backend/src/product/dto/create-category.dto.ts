import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
export class createCategoryDto{

    @Type(()=>String)
    @IsNotEmpty()
    @IsString()
    name:string    
}