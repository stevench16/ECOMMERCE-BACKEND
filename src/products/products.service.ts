import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import async_foreach= require('../utils/async_foreach');
import storage= require('../utils/cloud_storage');

@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productsRepository: Repository<Product>){}

    findAll() {
        return this.productsRepository.find();
    }

    findByCategory(id_category: number) {
        return this.productsRepository.find({
            where: {
                category: { id: id_category } // ✅ Forma correcta de filtrar por clave foránea
            },
            relations: ['category'] // ✅ Opcional: si quieres cargar la relación completa
        });
    }

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

                await this.update(savedProduct.id, savedProduct);
                uploadedFiles = uploadedFiles + 1;
            })
        }
        await startForEach();
        return savedProduct;

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

    async delete (id:number, product: UpdateProductDto){
        const productFound = await this.productsRepository.findOneBy({ id: id });
        if (!productFound) { 
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND);
        }
        return this.productsRepository.delete(id);
    }

    async updateWithImage(files: Array<Express.Multer.File>, id: number, product: UpdateProductDto) {

        if (files.length === 0) {
            throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND);
        }

        let counter = 0;
        let uploadedFiles = Number(product.images_to_update[counter]); //Cuenta cuantos archivos se han subido a Firebase

        const updateProduct = await this.update(id, product);

        const startForEach = async () => {
            await async_foreach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if(uploadedFiles == 0){
                        updateProduct.image1 = url
                    }
                    else if(uploadedFiles == 1){
                        updateProduct.image2 = url
                    }
                }

                await this.update(updateProduct.id, updateProduct);
                counter++;
                uploadedFiles = Number(product.images_to_update[counter]);
            })
        }
        await startForEach();
        return updateProduct;

    }
}
