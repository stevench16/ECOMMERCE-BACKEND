import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {

    constructor(private UsersService: UsersService) { }

    //GET       -> OBTENER
    //POST      -> CREAR
    //PUT-PATCH -> ACTUALIZAR
    //DELETE    -> BORRAR

    @UseGuards(JwtAuthGuard)
    @Get()// http://localhost/users
    findAll(@Body() user: CreateUserDto) {
        return this.UsersService.findAll();
    }

    @Post()// http://localhost/users
    create(@Body() user: CreateUserDto) {
        return this.UsersService.create(user);
    }


}
