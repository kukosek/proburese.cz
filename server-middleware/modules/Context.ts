import {BuresUser as User} from "../entity/User"
import {Session} from "express-session"
export interface ContextType {
	session: Session
	user: User
}
