require('dotenv').config()
import {SnakeNamingStrategy} from "typeorm-naming-strategies"

export default {
	"name": "default",
	"type": process.env.DB_TYPE,
	"host": process.env.DB_HOST,
	"port": process.env.DB_PORT,
	"username": process.env.DB_USERNAME,
	"password": process.env.DB_PASSWORD,
	"database": process.env.DB_NAME,
	"synchronize": true,
	"logging": false,
	"entities": [
		"server-middleware/entity/*.*"
	],
	namingStrategy: new SnakeNamingStrategy(),
	cache: {
		duration: 30000
	}
}
