import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

    constructor(private productsService: ProductsService) {}

        @HasRoles(JwtRole.ADMIN)
        @UseGuards(JwtAuthGuard, JwtRolesGuard)
        @Post() // http:172.27.44.141:3000/categories-> post
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
    @Put('upload/:id') // Actualizar con imagen
    @UseInterceptors(FilesInterceptor('files[]', 2))
    UpdateWithImage(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                    new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/ }),
                ],
            }),
        ) files: Array<Express.Multer.File>,
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto
    ) {    
        return this.productsService.updateWithImage(files, id, product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id') // Actualizar sin imagen
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto
    ) {    
        return this.productsService.update(id, product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(':id') // Borrar
    delete(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto // Agregar este parámetro
    ) {    
        return this.productsService.delete(id, product);
    }

}
