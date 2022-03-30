import express from "express";

import isAuth from "../middleware/authentication.js";

import { 
    Signup,
    Login,
    ChangePassword,
    Profile
} from "../controllers/users.controller.js";

//validators
import {
    validateSignup,
    validateChangePassword,
    validateLogin
} from "../validations/user.validators.js";

const router = express.Router();

//Signup
router.post("/signup",validateSignup, async (req, res, next) => {
    try {
        const user = await Signup (req.body);

        return res.status(user.code).json(user);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot signup",
        });
    }
});

//Login
router.post("/signin",validateLogin, async (req, res, next) => {
    try {
        const user = await Login (req.body);

        return res.status(user.code).json(user);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot login",
        });
    }
});

//change password
router.post("/change_password", isAuth, validateChangePassword, async (req, res, next) => {
    try {
        req.body.user = req.currentUser.id
        const user = await ChangePassword (req.body);

        return res.status(user.code).json(user);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot change password",
        });
    }
});

//Fetch User Profile
router.get("/me", isAuth, async (req, res, next) => {
    try {
        const user = await Profile (req.currentUser.id);

        return res.status(user.code).json(user);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot fetch user profile",
        });
    }
});

export default router;