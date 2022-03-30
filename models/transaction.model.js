import db from "../config/database.js"

db.schema.createTable('transactions', function (table) {
    table.increments('id',{primaryKey:true});
    table.integer('receiver_id',{unsigned:true});
    table.decimal('amount');
    table.string('receiver_email');
    table.integer('user_id',{unsigned:true})
    table.enu('type',['topup','withdraw','transfer']).defaultTo("transfer");
    table.timestamps(true,true);
    
});