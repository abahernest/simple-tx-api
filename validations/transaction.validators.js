import { validator, sendError } from "./index.js";

export function validateTopup (req, res, next) {
    const validationRule = {
        amount: "required|numeric",
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            sendError(res, err);
        } else {
            next();
        }
    });
}

export function validateWithdrawal(req, res, next) {
  const validationRule = {
    amount: "required|numeric",
    transaction_pin: "required|string|min:4|max:4",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      sendError(res, err);
    } else {
      next();
    }
  });
}

export function validateTransfer (req, res, next) {
    const validationRule = {
        amount: "required|numeric",
        email: "required|string|email",
        transaction_pin:"required|string|min:4|max:4"
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            sendError(res, err);
        } else {
            next();
        }
    });
}

export function validateCreateTxPin (req, res, next) {
    const validationRule = {
        transaction_pin:"required|string|min:4|max:4"
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            sendError(res, err);
        } else {
            next();
        }
    });
}

export function validateChangeTxPin (req, res, next) {
    const validationRule = {
        transaction_pin:"required|string|min:4|max:4",
        new_transaction_pin:"required|string|min:4|max:4"
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            sendError(res, err);
        } else {
            next();
        }
    });
}
