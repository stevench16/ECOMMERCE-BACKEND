import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository <User>
    ){}

    create(user:CreateUserDto){
        const newUser=this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    findAll(){
        return this.userRepository.find()
    }

    async update(id:number, user:UpdateUserDto){

        const userFound= await this.userRepository.findOneBy({id:id});

        if(!userFound){

            return new HttpException ('Usuario no existe', HttpStatus.NOT_FOUND);

        }

        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
                
    }
}
