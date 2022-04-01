
exports.up = function(knex) {
  return knex.schema
    .createTable("users", function (table) {
        table.increments();
        table.string("fullname");
        table.string("password");
        table.string("email");
        table.boolean("transaction_pin_set").defaultTo(false);
        table.string("transaction_pin");
        table.timestamps(true, true);
    })
    .createTable("transactions", function (table) {
        table.increments();
        table.integer("receiver_id");
        table.decimal("amount");
        table.string("receiver_email");
        table.integer("user_id");
        table.enu("type", ["topup", "withdraw", "transfer"]).defaultTo("transfer");
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
        .dropTable("users")
        .dropTable("transactions");
};
