import {
  Entity, Column, Unique, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity, ManyToMany, JoinTable, ManyToOne,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { MinLength, IsNotEmpty, isNotEmpty } from 'class-validator';
import { User } from './User';
import { Category } from './Category';

@ObjectType()
@Entity()
@Unique(['username']) 
export  class Recipe extends BaseEntity {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(12)
  @Unique(['username'])
  @IsNotEmpty()
  name!: string;

  @Column()
  @MinLength(12)
  @IsNotEmpty()
  description!: string;

  @Column()
  @MinLength(12)
  @IsNotEmpty()
  ingredients!: string;

  @IsNotEmpty() 
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: string;

  @Column()
  @MinLength(12)
  @IsNotEmpty()
  @Field(() => Category, {nullable: true})
  @ManyToOne(() => Category, category => category.recipes)
  category!: string;
}
