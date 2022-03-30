import { tokenVerifier } from "../helpers/jwtHelper.js";
import db from "../config/database.js";

const isAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if ((authHeader && authHeader.split(" ")[0] === "Token") || (authHeader && authHeader.split(" ")[0] === "Bearer")) {
        const token = authHeader.split(" ")[1];

        try {
            let decodedToken = await tokenVerifier(token);
            if (!decodedToken.id) {
                return res.status(401).json({
                    error: "true",
                    message: "token expired",
                });
            }
            
            //Check that user with id and email still exists
            const user = await db('users').where({
                id:  decodedToken.id,
                email: decodedToken.email,
            })

            if (user.length<1){
                return res.status(401).json({
                    error: "true",
                    message: "Invalid Token. Login Again",
                });
            }
            req.currentUser = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({
                error: "true",
                message: "Invalid authorization header",
            });
        }
    } else {
        return res.status(401).json({
            error: "true",
            message: "Access denied! No token provided",
        });
    }
};

export default isAuth;
