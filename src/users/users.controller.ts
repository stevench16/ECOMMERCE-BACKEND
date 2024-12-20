import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private UsersService: UsersService){}

    @Post()// http://localhost/users
    create(@Body() user: CreateUserDto){
        return this.UsersService.create(user);
    }
}
