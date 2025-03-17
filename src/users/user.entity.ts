import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";
import { Address } from "src/address/address.entity";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    notification_token: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    update_at: string;

    @JoinTable({
        name: 'user_has_roles',
        joinColumn:{
            name:'id_user'
        },
        inverseJoinColumn:{
            name:'id_rol'
        }
    }
    )
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles:Rol[];

    @ManyToMany(() => Address, address => address.id)
    address : Address

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }

}