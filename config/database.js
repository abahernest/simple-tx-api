import knex from "knex";

const connectionConfig = {
    host : '127.0.0.1',
    port : 3306,
    user : 'apple',
    password : 'kylegenius',
    database : 'lendsqr_dev'
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
