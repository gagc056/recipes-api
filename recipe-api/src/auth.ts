import { MiddlewareFn } from "type-graphql";
import { Request, Response, NextFunction } from "express";
import { getRepository } from 'typeorm';
import { UserResolver } from "./resolver/UserResolver";
import * as bcrypt from "bcryptjs"; import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'SECRET KEY NEEDED!'

export const createToken = async (payload:Record<string, unknown>, expiresIn:string) => {

	const token = await jwt.sign(payload, SECRET_KEY , { expiresIn })

	return token
}

export const Auth = async (req) => {
  try {
    req.email = null;
    req.loggedInUserId = null;
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey');
      req.email = payload.email;
      const user = await User.findOne({ name: payload.name });
      req.loggedInUserId = user.id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
