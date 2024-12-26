import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto{
    
    @IsNotEmpty()
    @IsString()    
    name?:string;

   
    @IsString()    
    lastname?:string;

    @IsNotEmpty()
    @IsString()    
    phone?:string;

    image?:string;
    notification_token?:string;
}