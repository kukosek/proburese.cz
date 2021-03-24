import "reflect-metadata"; import Express from 'express'
require('dotenv').config()
import cors from 'cors'
import {ApolloServer} from 'apollo-server-express';

import {createConnection} from "typeorm";

import {
	buildSchema
} from 'type-graphql';


import {DonateResolver} from "./modules/Donate"




const app = Express();

const main = async () => {
	await createConnection();

	const schema = await buildSchema({
		resolvers: [DonateResolver]
	});
	const apolloServer = new ApolloServer({
		schema: schema,
		//debug plugin
		/*
		plugins: [
			{
				requestDidStart: (requestContext) => {
					if (requestContext.request.http?.headers.has('x-apollo-tracing')) {
						return;
					}
					const query = requestContext.request.query?.replace(/\s+/g, ' ').trim();
					const variables = JSON.stringify(requestContext.request.variables);
					console.log(new Date().toISOString(), `- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${requestContext.request.operationName} }`);
					return;
				},
			},
		]
		*/
	})


	apolloServer.applyMiddleware({app})

	app.use(cors())
	app.listen(parseInt(process.env.PORT_APOLLO!), process.env.HOST!, () => {
		console.log(" 🚀Server started")
	})

}
main()

export default {
	path: "/api",
	handler: app
}
