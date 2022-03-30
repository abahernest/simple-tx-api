import express from "express";

import isAuth from "../middleware/authentication.js";

import { 
    Transfer,
    Topup,
    Withdrawal,
    CreateTransactionPin,
    ChangeTransactionPin,
    MyBalance,
    UserTransactions
} from "../controllers/transactions.controller.js";

//validators
import {
    validateChangeTxPin,
    validateCreateTxPin,
    validateTopup,
    validateWithdrawal,
    validateTransfer
} from "../validations/transaction.validators.js";

const router = express.Router();

//all transactions
router.get("/", isAuth, async (req, res, next) => {
    try {
        req.query.user=req.currentUser.id
        const transaction = await UserTransactions (req.query);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot fetch transations",
        });
    }
});

//Topup
router.post("/topup", isAuth,validateTopup, async (req, res, next) => {
    try {
        req.body.user=req.currentUser.id
        const transaction = await Topup (req.body);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot topup",
        });
    }
});

//Withdrawal
router.post("/withdraw", isAuth, validateWithdrawal, async (req, res, next) => {
    try {
        req.body.user=req.currentUser.id
        console.log(req.body)
        const transaction = await Withdrawal (req.body);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot withdraw funds",
        });
    }
});

//new tx pin
router.post("/create_pin", isAuth, validateCreateTxPin, async (req, res, next) => {
    try {
        req.body.user=req.currentUser.id
        const transaction = await CreateTransactionPin (req.body);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot create pin",
        });
    }
});

//Change Pin
router.patch("/change_pin", isAuth, validateChangeTxPin, async (req, res, next) => {
    try {
        req.body.user=req.currentUser.id
        const transaction = await ChangeTransactionPin (req.body);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot change pin",
        });
    }
});

//Transfer
router.post("/transfer", isAuth, validateTransfer, async (req, res, next) => {
    try {
        req.body.user=req.currentUser.id
        const transaction = await Transfer (req.body);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot transfer",
        });
    }
});

//balance
router.get("/balance", isAuth, async (req, res, next) => {
    try {
        const transaction = await MyBalance(req.currentUser.id);

        return res.status(transaction.code).json(transaction);
    } catch (e) {
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, cannot fetch balance",
        });
    }
});
export default router;