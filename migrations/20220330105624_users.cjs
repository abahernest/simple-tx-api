exports.up = function (knex) {
  return knex.schema
    .createTable("transactions", function (table) {
      table.increments("id", { primaryKey: true });
      table.integer("receiver_id", { unsigned: true });
      table.decimal("amount");
      table.string("receiver_email");
      table.integer("user_id", { unsigned: true });
      table
        .enu("type", ["topup", "withdraw", "transfer"])
        .defaultTo("transfer");
      table.timestamps(true, true);
    })
    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("fullname");
      table.string("password");
      table.string("email");
      table.boolean("transaction_pin_set").defaultTo(false);
      table.string("transaction_pin");
      table.timestamps(true, true);

      table.foreign("id").references("receiver_id").inTable("users");
      table.foreign("id").references("user_id").inTable("users");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transactions").dropTable("users");
};
