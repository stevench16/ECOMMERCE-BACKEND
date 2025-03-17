import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'address'})

export class Address{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column()
    id_user:number;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at:string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    update_at:string;

    @ManyToOne(()=> User, (user) => user.id)
    @JoinColumn ({name:'id_user'})
    user:User;



}