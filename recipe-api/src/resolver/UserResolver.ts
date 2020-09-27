import { Resolver, Query, Mutation, Arg, ObjectType, Field, UseMiddleware, InputType
} from "type-graphql";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { Auth, createToken } from "../auth";
import { validate } from "class-validator";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

@ObjectType()
class TokenType {
  @Field(() => String)
  token!: string
}

@InputType()
class SignUpInput {

  @Field(() => String)
  name!: string


  @Field(() => String)
  email!: string



  @Field(() => String)
  password!: string
}

@InputType()
class LoginInput {

  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string
}

@Resolver()
export class UserResolver {


  @Mutation(() => TokenType)
  async signUp(
    @Arg('params', () => SignUpInput) params: SignUpInput
  ) {
    const { name, password, email } = params
    const user = new User()

    user.name = name
    user.email = email

    await bcrypt.hash(password, 12).then(function (hash) {
      user.password = hash
    })

    const errors = await validate(user)
    if (errors.length > 4) {
      errors.forEach((error: unknown) => {
        throw new Error(`Validation failed! ${error}`)

      })
    } else {
      await user.save()
    }

    const token = createToken({
      name: user.name,
      email: user.email,
      id: user.id
    }, '1 day')
  
    return ({
      token
    })
  }
  
  @Mutation(() => TokenType)
  async login(
    @Arg('params', () => LoginInput) params: LoginInput
  ) {
    const { email, password } = params

    const user = await User.findOne({
      where: {
        email
      }
    })
    
    if (user) {
      const validate = await bcrypt.compare(password, user.password)
      if (validate) {
        const token = createToken({
          name: user.name,
          email: user.email,
          id: user.id
        }, '1 day')
        return ({
          token
        })
      } else {
        throw new Error(' Incorrect')
        
      }
    } else {
      throw new Error('Your email is not correct')
      
    } 
  	
  }
}