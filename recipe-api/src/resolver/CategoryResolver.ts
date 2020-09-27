import { Resolver, Query, Mutation, Arg, Field, InputType, Int } from "type-graphql";

import { Category } from '../entity/Category';


@InputType()
class CategoryInput {
  @Field()
  name!: string
}

@InputType()
class GetCategoriesInput {
  @Field(() => String, { nullable: true })
  name?: string
}

@InputType()
class CategoryUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string
}

@Resolver()
export class CategoryResolver {

  @Mutation(() => Category)
  async createCategory(
    @Arg("fields", () => CategoryInput) fields: CategoryInput,
  ) {
    const newCategory = Category.create(fields);
    console.log(newCategory)
    return await newCategory.save()
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id", () => Int) id: number) {
    await Category.delete(id)
    return true
  }

  @Mutation(() => Boolean)
  async updateCategory(
    @Arg("id", () => Int) id: number,
    @Arg("fields", () => CategoryUpdateInput) fields: CategoryUpdateInput
  ) {
    await Category.update({ id }, fields)
    return true;
  }

  @Query(() => [Category])
  categories() {
    return Category.find()
  }

  @Query(() => [Category])
  async getCategories(
    @Arg("fields", () => GetCategoriesInput) fields: GetCategoriesInput
  ) {
    return await Category.find(fields)
  }
}