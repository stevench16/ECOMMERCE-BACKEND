import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/uptadate-product.dto';

@Controller('products')
export class ProductsController {

    constructor(private productsService: ProductsService) {}

        @HasRoles(JwtRole.ADMIN)
        @UseGuards(JwtAuthGuard, JwtRolesGuard)
        @Put() // http:172.27.44.141:3000/categories-> post
        @UseInterceptors(FilesInterceptor('files[]', 2))
        Create(
            @UploadedFiles(
                new ParseFilePipe({
                    validators: [
                        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                    ],
                }),
            ) files: Array<Express.Multer.File>,
            @Body() product: CreateProductDto
        ) {    
            return this.productsService.create(files, product);
        }

        @HasRoles(JwtRole.ADMIN)
        @UseGuards(JwtAuthGuard, JwtRolesGuard)
        @Put(':id')
        async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto
        ) {
        console.log("ID recibido en el controlador:", id); // Debug
        return this.productsService.update(id, product);
        }

}
