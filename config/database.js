import knex from "knex";

const connectionConfig = {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
}
const db = knex({
  client: 'mysql2',
  connection: connectionConfig,
  log: {
    warn(message) {
    },
    error(message) {
    },
    deprecate(message) {
    },
    debug(message) {
    },
  }
})

export default db;
// const knex = Knex({
//   client: 'mysql2'
// });

// export const connectDB = mysql.createConnection(connectionConfig);
// // await connection.connect();
