import { Query, Resolver, Authorized, Mutation, InputType, Field, Int, Arg, Ctx  } from "type-graphql"
import { getRepository } from "typeorm";
import { Category } from "../entity/Category";

import { Recipe } from '../entity/Recipe';
import { User } from "../entity/User";

@InputType()
class CreateRecipeInput {

  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  ingredients!: string

  @Field(() => Int)
  categoryId!: number

}

@InputType()
class UpdateRecipeInput {

  @Field(() => Int)
  id!: number

  @Field(() => String, {nullable: true})
  name?: string

  @Field(() => String, {nullable: true})
  description?: string

  @Field(() => String, {nullable: true})
  ingredients?: string

  
}

@Resolver()
export class RecipeResolver {

  @Authorized()
  @Mutation(() => Recipe)
	async createRecipe(
    @Arg('params', () => CreateRecipeInput) params: CreateRecipeInput,
    @Ctx() context: any
	) {

		const {
			name,
			description,
			ingredients,
			categoryId
		} = params

		const recipeRepository = getRepository(Recipe)

		const categoryRepository = getRepository(Category)
		const category = await categoryRepository.findOne(categoryId)

		const userId = context.user.id
		const userRepository = getRepository(User)
		const user = await userRepository.findOne(userId)

		if(user && category) {
			const recipe = recipeRepository.create({
				description: String,
				name: String,
        ingredients: String,
        user: User,
        category:Category
      })
			return await recipeRepository.save(recipe)
			
		}
		throw new Error('Error')
    
	}
  
  @Authorized()
  @Mutation(() => Recipe)
  async updateRecipe(
    @Arg('params', () => UpdateRecipeInput) params: UpdateRecipeInput,
    @Ctx() context: any
  ) {

  	const {
  		id,
  		name,
  		description,
  		ingredients
  	} = params

  	const recipeRepository = getRepository(Recipe)
  	const userRepository = getRepository(User)

  	const user = await userRepository.findOne(context.user.id)
  	const recipe = await recipeRepository.findOne({
  		relations: ['user', 'category'],
  		where: {
  			id,
  			user
  		}
  	})
  	if(recipe) {
      

  		if(name) recipe.name = name
  		if(description)  recipe.description = description
  		if(ingredients) recipe.ingredients = ingredients


  		return recipe
  	} else {
  		throw new Error('You dont have this recipe')
      
  	}
  
  }

  @Authorized()
  @Mutation(() => String)
  async deleteRecipe(
    @Arg('id', () => Int) id: number
  ) {
  	const recipeRepository = getRepository(Recipe)

  	const recipe = await recipeRepository.findOne(id)

  	if(recipe) {
  		await recipeRepository.remove(recipe)
  	}
    

  	return 'Your recipe was erased'
  }


  @Authorized()
  @Query(() => [Recipe])
  async getRecipes() {
  	const recipeRepository = getRepository(Recipe)

  	const recipe = await recipeRepository.find({
  		relations: ['user', 'category']
  	})

  	return recipe
  }

  @Authorized()
  @Query(() => Recipe)
  async getOneRecipe(
    @Arg('id', () => Int) id: number
  ){
  	const recipeRepository = getRepository(Recipe)

  	const recipe = await recipeRepository.findOne({
  		relations: ['category', 'user'],
  		where: {
  			id
  		}
  	})


  	return recipe
  }

  @Authorized()
  @Query(() => [Recipe])
  async getMyRecipes(@Ctx() context: any){
  	const userRepository = getRepository(User)

  	const user = await userRepository.findOne({
  		join: {
  			alias: 'user',
  			leftJoinAndSelect: {
  				recipes: 'user.recipes'
  			}
  		},
  		where: {
  			id: context.user.id
  		}
    
  	})


   user?.recipes
  }
}
