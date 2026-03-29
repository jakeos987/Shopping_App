import { IsEmail, IsString, IsNotEmpty, MinLength, maxLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../entities/user.entity';


export class CreateUserDto {
    @IsEmail({}, { message: 'invalid email format' })
    email: string

    @IsNotEmpty()
    @MinLength(8, { message: 'password ' })
    password: string

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @IsString()
    picture?: string

}
