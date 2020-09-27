/* eslint-disable no-unused-vars */
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique, CreateDateColumn, OneToMany,
} from 'typeorm';
import { MinLength, IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Recipe } from './Recipe';

@ObjectType()
@Entity()

@Unique(['name'])
export  class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  

  @Column()
  @MinLength(12)
  @IsNotEmpty()
  name!: string;

  @Field(() => [Recipe], {nullable: true})
  @OneToMany(() => Recipe, recipe => recipe.category)
  recipes!: Recipe[];

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: string;
}
