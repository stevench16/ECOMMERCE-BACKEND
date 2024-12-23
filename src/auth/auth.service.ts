import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {compare} from 'bcrypt';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
      private jwtServices: JwtService
    ) { }
    async register(user: RegisterAuthDto) {

        const emailExist = await this.userRepository.findOneBy({ email: user.email })

        if (emailExist) {
            // 409 conflicto que puede ser solucionado por el usuario
            return new HttpException('El email ingresado ya se encuentra registrado.', HttpStatus.CONFLICT);
        }

        const phoneExist = await this.userRepository.findOneBy({ phone: user.phone })

        if (phoneExist) {
            // 409 conflicto que puede ser solucionado por el usuario
            return new HttpException('El numero telefonico ingresado ya se encuentra registrado.', HttpStatus.CONFLICT);
        }

        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);

    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData;

        const userFound = await this.userRepository.findOneBy({ email: email })

        if (!userFound) {
            return new HttpException('El correo electronico ingresado no existe.', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password);

        if (!isPasswordValid) {
            
            //403 FORBIDDEN Acces denied
            return new HttpException('La contraseña es incorrecta.', HttpStatus.FORBIDDEN)

        }

        const payload ={id : userFound.id, name : userFound.name};
        const token=this.jwtServices.sign(payload);

        const data={
            user: userFound,
            token:token
        }

        return data;
    }
}
