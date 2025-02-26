import { Category } from "src/categories/category.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products'})
export class Product {

    @PrimaryGeneratedColumn()
    id: String;

    @Column()
    name: String;

    @Column()
    description: String;

    @Column()
    image1: String;
    
    @Column()
    image2: String;
    
    @Column()
    price: Number;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
        created_at:Date;
    
    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    update_at:Date;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({name: 'id_category'})
    category: Category

}