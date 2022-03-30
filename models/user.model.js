import db from "../config/database.js"

db.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('fullname');
    table.string('password');
    table.string('email');
    table.boolean('transaction_pin_set').defaultTo(false);
    table.string('transaction_pin');
    table.timestamps(true,true);

    table.foreign("id").references("receiver_id").inTable("users");
    table.foreign("id").references("user_id").inTable("users");
})