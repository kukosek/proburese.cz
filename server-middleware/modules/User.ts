import {
	Resolver, Query, Arg,
	Mutation, Ctx,
	Authorized
} from 'type-graphql';

import {ContextType} from './Context';

import {BuresUser as User} from "../entity/User"


@Resolver(User)
export class UserResolver {
	@Query(() => User, {nullable: true})
	async me(@Ctx() ctx: ContextType) {
		return ctx.user
	}

	@Authorized()
	@Mutation(() => User)
	async logout(@Ctx() ctx: ContextType) {
		return ctx.session.destroy((err) => {
			if (err) {
				return ctx.user
			} else {
				return null
			}
		})
	}
}
