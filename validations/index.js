import Validator from "validatorjs";

export function validator(body, rules, customMessages, callback) {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
}

export function sendError(res, err) {
    const firstError = err.errors[Object.keys(err.errors)[0]][0];
    res.status(412).send({
        code: 412,
        status: "failed",
        error: true,
        message: firstError,
    });
}

