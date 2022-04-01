import Knex from "../config/database.js"

const User = Knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('fullname');
    table.string('password');
    table.string('email');
    table.boolean('transaction_pin_set').defaultTo(false);
    table.string('transaction_pin');
    table.timestamps(true,true);
})

export default User;