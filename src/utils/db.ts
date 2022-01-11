import { Sequelize } from "sequelize";

const dbName = "test"; 
const dbUser = "root";
const dbPass = "";

const db = new Sequelize(dbName, dbUser, dbPass, {
    host: "localhost",
    dialect: "mysql"
    , logging: false
});

export default db;
