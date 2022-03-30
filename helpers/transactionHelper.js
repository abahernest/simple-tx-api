import db from "../config/database.js"

export async function getBalance(user_id) {
    let transactions = await db("transactions")
      .where({ user_id: user_id })
      .sum({balance:'amount'})

      if (transactions.length<1){
          return 0
      }
      
    return transactions[0].balance
}
