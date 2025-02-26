import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ ProductsController, Category ])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
