//model
import db from "../config/database.js";
import { hash, verifyHash, generateJwtToken } from "../helpers/jwtHelper.js";
import {getBalance} from "../helpers/transactionHelper.js"

export async function Withdrawal (data) {
    try {
      //verify tx pin
      const user = await db("users")
        .where({ id: data.user })
        .select("transaction_pin", "transaction_pin_set");

      //Check that transaction pin is set
      if (!user[0].transaction_pin_set) {
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "please set transaction pin",
        };
      }

      const isValidPin = await verifyHash(
        data.transaction_pin,
        user[0].transaction_pin
      );
      if (!isValidPin) {
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "invalid pin",
        };
      }

      //check balance
      const balance = await getBalance(data.user)

      if (balance < data.amount) {
        return {
          code: 400,
          status: "failure",
          error: true,
          message: "insufficient funds",
        };
      }

      let transaction_obj = {
        type: "withdraw",
        user_id: data.user,
        amount: -data.amount,
      };

      //create withdrawal transactions
      let transaction = await db("transactions").insert(transaction_obj);
      transaction = await db("transactions")
        .where({ id: transaction[0] })
        .select("*");

      return {
        code: 200,
        status: "success",
        error: false,
        message: "Withdrawal Successful",
        data: transaction,
      };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not withdraw funds",
      };
    }
}

export async function Transfer (data) {
    try {
      //verify tx pin
      const user = await db("users")
        .where({ id: data.user })
        .select("transaction_pin", "transaction_pin_set");
      
      if (!user[0].transaction_pin_set) {
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "please set transaction pin",
        };
      }

      const isValidPin = await verifyHash(
        data.transaction_pin,
        user[0].transaction_pin
      );
      if (!isValidPin) {
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "invalid pin",
        };
      }

      //check balance
      const balance = await getBalance(data.user);

      if (balance < data.amount) {
        return {
          code: 400,
          status: "failure",
          error: true,
          message: "insufficient funds",
        };
      }

      //verify receiver email
      const receiver = await db("users")
        .where({ email: data.email })
        .select("id");

      if (receiver.length < 1) {
        return {
          code: 404,
          status: "failed",
          error: true,
          message: "No user with that email",
        };
      }

      let transaction_obj = {
        type: "transfer",
        user_id: data.user,
        receiver_id: receiver[0].id,
        receiver_email: receiver[0].email,
        amount: -data.amount,
      };

      //create withdrawal transactions
      let transaction = await db("transactions").insert(transaction_obj);
      transaction = await db("transactions")
        .where({ id: transaction[0] })
        .select("*");

      return {
        code: 200,
        status: "success",
        error: false,
        message: "Transfer Successful",
        data: transaction,
      };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not transfer funds",
      };
    }
}

export async function MyBalance(user_id) {
  try {
    //check balance
    const balance = await getBalance(user_id);

    return {
      code: 200,
      status: "success",
      error: false,
      message: "Successful",
      data: balance,
    };
  } catch (e) {
    return {
      code: 500,
      status: "failed",
      error: true,
      message: "something went wrong, could not transfer funds",
    };
  }
}

export async function Topup (data) {
    try {
        let transaction_obj = {
            type:"topup",
            user_id:data.user,
            amount: data.amount
        }

        //create topup transactions
        let transaction = await db("transactions").insert(transaction_obj)
        transaction = await db("transactions").where({id:transaction[0]}).select('*')
        return {
            code: 200,
            status: "success",
            error: false,
            message: "Successful",
            data: transaction
        };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not topup",
      };
    }
}

export async function CreateTransactionPin (data) {
    try {
        //Hash transaction Pin
        data.transaction_pin = await hash(data.transaction_pin.toString())

        //update user
        await db("users")
        .update({ transaction_pin: data.transaction_pin, transaction_pin_set: true })
        .where({id:data.user});

        return {
            code: 200,
            status: "success",
            error: false,
            message: "transaction pin set",
        };
    } catch (e) {
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not create transaction pin",
        };
    }
}

export async function ChangeTransactionPin (data) {
    try {
      //update user
      let user = await db("users")
        .where({ id: data.user })
        .select('transaction_pin','transaction_pin_set')
        ;

        if (!user[0].transaction_pin_set){
            return {
            code: 400,
            status: "failed",
            error: true,
            message: "transaction pin not set",
            };
        }

      //verify old transaction Pin
      const isValidPin = await verifyHash(
        data.transaction_pin.toString(),
        user[0].transaction_pin
      );

      if (!isValidPin) {
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "wrong pin",
        };
      }

      const transaction_pin = await hash(data.new_transaction_pin.toString());

      //update user
      await db("users")
        .update({ transaction_pin: transaction_pin, transaction_pin_set: true })
        .where({ id: data.user });

      return {
        code: 200,
        status: "success",
        error: false,
        message: "transaction pin changed",
      };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not change transaction pin",
      };
    }
}

export async function UserTransactions(data) {
    try {
      let { pageNo, limit, type } = data;
      pageNo = pageNo ? + parseInt(pageNo) : 1;
      limit = limit ? + parseInt(limit) : 9;

      let query = {
        user_id: data.user,
      };

      if (type) {
        query.type = type.trim();
      }
      
    const offset = (pageNo - 1) * limit;

    const total = await db("transactions").clone().count("* as count").where(query).first();
    let transactions = await db("transactions")
        .select("*")
        .limit(limit)
        .offset(offset)
        .orderBy("created_at", "desc")
        .where(query);

    let output = {
        metadata: {},
      };
    // console.log(total,transactions)
    output.metadata.total = parseInt(total.count, 10);
    output.metadata.limit = limit;
    output.metadata.pageNo = pageNo;
    output.data = transactions;

    return {
    code: 200,
    status: "success",
    error: false,
    message: "fetch transactions successfully",
    data: output,
    };


    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not fetch transactions",
      };
    }
}
