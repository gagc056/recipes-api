import { Entity, PrimaryGeneratedColumn, Column, Unique , OneToMany, JoinTable, CreateDateColumn } from "typeorm";
import { Recipe } from '../entity/Recipe';
import { Field } from "type-graphql";
import { MinLength, IsNotEmpty, IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';


@Entity()
@Unique(['name'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Field()
    @Column()
    email: string;
  
    @Column()
    @MinLength(6)
    password: string;
    
    @Field(() => [Recipe])
    @OneToMany(() => Recipe, recipe => recipe.user)
    recipes!: Recipe[];
  
    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string;
    static findOne: any;
    save: any;
 
}
