import { IsEmail,IsString,IsNotEmpty,MinLength,maxLength} from 'class-validator';



export class CreateUserDto {
    @IsEmail({},{message:'invalid email format'})
    email:string

    @IsNotEmpty()
    @MinLength(8,{message:'password '})
    password:string

    @IsString()
    @IsNotEmpty()
    firstName:string

    @IsString()
    @IsNotEmpty()
    lastName:string

    

    
}
