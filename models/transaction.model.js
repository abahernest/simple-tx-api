import Knex from "../config/database.js"

const Transaction = Knex.schema.createTable('transactions', function (table) {
    table.increments();
    table.integer('receiver_id');
    table.decimal('amount');
    table.string('receiver_email');
    table.integer('user_id')
    table.enu('type',['topup','withdraw','transfer']).defaultTo("transfer");
    table.timestamps(true,true);
});

export default Transaction;