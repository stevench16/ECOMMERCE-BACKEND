import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/uptadate-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import async_foreach= require('../utils/async_foreach');
import storage= require('../utils/cloud_storage');

@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productsRepository: Repository<Product>){}

    async create(files: Array<Express.Multer.File>, product: CreateProductDto) {

        if (files.length === 0) {
            throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND);
        }

        let uploadedFiles = 0;

        const newProduct = this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct); // Aquí realmente guarda el producto
        console.log("Producto guardado con ID:", savedProduct.id);

        const startForEach = async () => {
            await async_foreach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if(uploadedFiles == 0){
                        savedProduct.image1 = url
                    }
                    else if(uploadedFiles == 1){
                        savedProduct.image2 = url
                    }
                }

                if (!savedProduct.id) {
                    throw new HttpException("No se pudo obtener el ID del producto", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                await this.update(savedProduct.id, savedProduct);
                uploadedFiles = uploadedFiles + 1;

                if (uploadedFiles === files.length){
                    return savedProduct;
                }
            })
        }
        startForEach();

    }

    async update(id:number, product: UpdateProductDto){

        console.log("ID recibido para actualización:", id); 

        const productFound = await this.productsRepository.findOneBy({ id: id });
        if (!productFound) {
            console.log("El producto con ID", id, "no existe en la base de datos"); 
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND);
        }
        const updatedProduct = Object.assign(productFound, product);
        return this.productsRepository.save(updatedProduct);
    }


}
