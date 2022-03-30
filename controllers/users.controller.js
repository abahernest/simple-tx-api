//model
import db from "../config/database.js"
import {hash, verifyHash, generateJwtToken} from "../helpers/jwtHelper.js"

export async function Signup (data) {
    try {
        //Check that user email is unique
        let user = await db('users').where({email:data.email})

        if (user.length >=1) {
            return {
                code: 400,
                status: "failed",
                error: true,
                message: "email already exists",
            };
        }
        //hash password
        data.password = await hash(data.password.toString());
        
        //generate jwt 
        const token = await generateJwtToken(data);   

        //create user
        user = await db('users').insert(data)

        return {
            code: 200,
            status: "success",
            error: false,
            message: "Successful",
            data: {
                token:token,
                user: user
            }
        };
    } catch (e) {
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not signup",
        };
    }
}

export async function Login (data) {
    try {
      //Check that user email exists
      let user = await db("users")
        .select('id', 'email','fullname','password')
        .where({ email: data.email });

      if (user.length <1) {
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "wrong credentials",
        };
      }
      //validate password
      const isValidPassword = await verifyHash(data.password.toString(),user[0].password);

      if (!isValidPassword){
        return {
            code: 400,
            status: "failed",
            error: true,
            message: "wrong credentials",
        };
      }
      //generate jwt
      const token = await generateJwtToken(user[0]);

      delete user[0].password
      return {
        code: 200,
        status: "success",
        error: false,
        message: "Successful",
        data: {
          token: token,
          user: user,
        },
      };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not login",
      };
    }
}

export async function ChangePassword (data) {
    try {
      //Check that user exists
      let user = await db("users").where({ id: data.user }).select('id','fullname','email','password');

      //verify old password
      const isVerifiedPassword = await verifyHash(data.password, user[0].password)

      if (!isVerifiedPassword){
        return {
          code: 400,
          status: "failed",
          error: true,
          message: "wrong password",
        };
      }
      //hash new password
      const password = await hash(data.new_password.toString());

      //update password
      await db("users")
      .where({ id: data.user })
      .update({password:password})
      ;

      delete user[0].password
      return {
        code: 200,
        status: "success",
        error: false,
        message: "Successful",
        data: user,
      };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could not change password",
      };
    }
}

export async function Profile (user_id) {
    try {
      let user = await db("users")
        .select("id", "email", "fullname","created_at","updated_at","transaction_pin_set")
        .where({ id: user_id });

      return {
        code: 200,
        status: "success",
        error: false,
        message: "Successful",
        data: user
      };
    } catch (e) {
      return {
        code: 500,
        status: "failed",
        error: true,
        message: "something went wrong, could fetch user profile",
      };
    }
}