import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column()
    name: string;

    @OneToMany(()=> Product, product => product.category)
    products: Product[];

}