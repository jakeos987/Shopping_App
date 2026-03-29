import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    phone: string;
}
