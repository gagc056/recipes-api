import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from './resolver/UserResolver';
import { RecipeResolver } from './resolver/RecipeResolver';
import { CategoryResolver } from './resolver/CategoryResolver';
import {connect} from '../src/database'


const dotenv = require("dotenv");

createConnection().then(async connection => {
   
    const app = express();
    connect();
    const apolloserver = new ApolloServer({
        schema: await buildSchema({ resolvers: [CategoryResolver, UserResolver, RecipeResolver] })
    });

    apolloserver.applyMiddleware({ app, path: "/graphql" })
   
    app.listen(4000);

});

createConnection();


