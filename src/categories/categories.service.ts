import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import storage = require('../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>
    ) { }

    findAll(){
        return this.categoriesRepository.find()
    }

    async create(file: Express.Multer.File, category: CreateCategoryDto) {       

        const url = await storage(file, file.originalname);
        if (url === undefined && url === null) {
            throw new HttpException('La imagen no pudo ser guardada.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        category.image = url;
        const newCategory = this.categoriesRepository.create(category)
        return this.categoriesRepository.save(newCategory);

    }

    async update(id:number, category: UpdateCategoryDto) {       

        const categoryFound = await this.categoriesRepository.findOneBy({id:id});
       
        if(!categoryFound){
            throw new HttpException('La Categoría No Existe.', HttpStatus.NOT_FOUND);
        }

        const updateCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updateCategory)

    }

    async updateWithImage(file: Express.Multer.File, id:number, category: UpdateCategoryDto) {       

        const url = await storage(file, file.originalname);
        if (url === undefined && url === null) {
            throw new HttpException('La imagen no pudo ser guardada.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const categoryFound = await this.categoriesRepository.findOneBy({id:id});
        if(!categoryFound){
            throw new HttpException('La Categoría No Existe.', HttpStatus.NOT_FOUND);
        }

        category.image = url;
        const updatedCategory = Object.assign(categoryFound, category);
        return this.categoriesRepository.save(updatedCategory)

    }

    async delete (id:number){
        const categoryFound = await this.categoriesRepository.findOneBy({id:id});

        if(!categoryFound){
            throw new HttpException('La Categoría No Existe.', HttpStatus.NOT_FOUND);
        }

        return this.categoriesRepository.delete(id);

    }


}
