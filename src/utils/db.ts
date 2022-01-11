import { Sequelize } from "sequelize";

import 'dotenv/config'

const dbName: any = process.env.DB_NAME; 
const dbUser: any = process.env.DB_USER;
const dbPass: any = process.env.DB_PASS;
const dbHost: any = process.env.DB_HOST;

const db = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: "mysql",
    logging: false
});

export default db;
