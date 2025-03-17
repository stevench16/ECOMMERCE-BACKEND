import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {

    constructor (@InjectRepository (Address) private addressRepository: Repository<Address>){}

    create (address:CreateAddressDto){
        const newAddress = this.addressRepository.create(address);
        return this.addressRepository.save(newAddress);
    }
}
