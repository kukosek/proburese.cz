import Express from 'express'
require('dotenv').config()
import cors from 'cors'
import {ApolloServer} from 'apollo-server-express';

import {createConnection, getRepository} from "typeorm";

import {ContextType} from "./modules/Context"

import {
	buildSchema
} from 'type-graphql';


import {DonateResolver} from "./modules/Donate"
import {UserResolver} from "./modules/User"
import passport from "passport";

import {Strategy as FacebookStrategy} from "passport-facebook"

var session = require("express-session"),
	bodyParser = require("body-parser");

import {BuresUser} from "./entity/User"

import {TypeormStore} from "connect-typeorm"
import {Session} from "./entity/Session"

import {authChecker} from "./modules/auth-checker"






const app = Express();

const main = async () => {
	await createConnection();

	const sessionRepo = getRepository(Session)

	app.use(Express.static("public"));
	app.use(session({
		secret: "cats",
		cookie: {
			sameSite: true,
			maxAge: 30 * 24 * 60 * 60 * 1000
		},
		store: new TypeormStore({
			cleanupLimit: 2,
			limitSubquery: false, // If using MariaDB.
		}).connect(sessionRepo)
	}));
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user: any, done) => {
		done(null, user.profileId)
	});

	passport.deserializeUser((user: string, done) => {
		BuresUser.findOne({where: {profileId: user}}).then((user) => {
			done(null, user)
		});
	});

	const schema = await buildSchema({
		resolvers: [DonateResolver, UserResolver],
		authChecker: authChecker,
	});
	const apolloServer = new ApolloServer({
		schema: schema,
		context: ({req}) => {
			const context = {
				req,
				user: req.user,
				session: req.session
				//user: req.user, // `req.user` comes from `express-jwt`
			};
			return context;
		},
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

	const base_url: String = "" + process.env.OAUTH_REDIRECT_BASEURL

	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_CLIENT_ID!,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
		callbackURL: process.env.OAUTH_REDIRECT_BASEURL + "/api/auth/facebook/callback"
	},
		(accessToken: String, refreshToken: String, profile: passport.Profile, done) => {
			BuresUser.findOne({where: {profileId: profile.id}}).then((foundUser) => {
				if (!foundUser) {
					foundUser = BuresUser.create()
					foundUser.profileId = profile.id
					foundUser.displayName = profile.displayName
					foundUser.save()
				}
				return done(null, foundUser)
			})
		}
	));




	app.get('/auth/facebook', passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: base_url + '/',
			failureRedirect: base_url + '/login'
		}));


	app.listen(parseInt(process.env.PORT_APOLLO!), process.env.HOST!, () => {
		console.log(" 🚀Server started")
	})

}
main()

export default {
	path: "/api",
	handler: app
}
