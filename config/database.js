import knex from "knex";
import environments from "../knexfile.cjs"
const currentEnv = process.env.NODE_ENV || "development";

const db = knex(environments[currentEnv]);

export default db;

// // await connection.connect();
