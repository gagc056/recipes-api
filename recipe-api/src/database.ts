import {createConnection} from 'typeorm'
const path = require('path');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function connect() {
	await createConnection({
		type:'mysql',
		host: process.env.HOST || 'localhost',
		port: 3306,
		username: process.env.DB_USERNAME || 'localhost',
		password: process.env.DB_PASSWORD || '9098',
		database: process.env.DB_NAME || 'puzzle',
		entities: [
			path.join(__dirname, '../entity/**/**.ts')
		],
		synchronize: true
	})
	console.log('Database is Connected')
}
