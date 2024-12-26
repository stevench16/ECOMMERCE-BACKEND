import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    lastname:string;

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message:'El email no es valido'})
    email:string;

    @IsNotEmpty()
    @IsString()
    phone:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message:'La contraseña debe tener minimo 6 caracteres'})
    password:string;

    image?:string;
    
    notification_token?:string;
}