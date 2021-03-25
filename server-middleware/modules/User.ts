import {
	Resolver, Query, Arg,
	Field, ArgsType, Args,
	registerEnumType, ID, InputType,
	Mutation, Ctx,
	Authorized
} from 'type-graphql';

import {ContextType} from './Context';

import {BuresUser as User} from "../entity/User"


@Resolver(User)
export class UserResolver {
	@Authorized()
	@Query(() => User)
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
