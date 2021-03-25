import {
	AuthChecker
} from "type-graphql"

import {BuresUser as User} from "../entity/User"

export type AccessLevels = "USER" | "ADMIN";

export const authChecker: AuthChecker<{user: User | null}, AccessLevels>
	= ({context}, roles): boolean => {
		if (!context.user) {
			return false
		}
		return true; // or false if access is denied
	};
