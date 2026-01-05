import { IsEmail,IsNotEmpty,IsString ,MinLength} from "class-validator";

export class LoginDto{
    @IsEmail()
    email:string

    @IsNotEmpty({message:'password is required'})
    @IsString()
    @MinLength(8)
    password:string
}