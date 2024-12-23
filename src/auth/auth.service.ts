import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';



@Injectable()
export class AuthService {

    constructor (@InjectRepository (User) private userRepository: Repository<User>){}
    async register(user: RegisterUserDto){

        const emailExist = await this.userRepository.findOneBy({email:user.email})

        if (emailExist){
            // 409 conflicto que puede ser solucionado por el usuario
            return new HttpException ('El email ingresado ya se encuentra registrado.', HttpStatus.CONFLICT);
        }

        const phoneExist = await this.userRepository.findOneBy({phone:user.phone})

        if (phoneExist){
            // 409 conflicto que puede ser solucionado por el usuario
            return new HttpException ('El numero telefonico ingresado ya se encuentra registrado.', HttpStatus.CONFLICT);
        }

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);

    }
}
