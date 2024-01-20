import joi from "joi";

export const loginBody = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

export const registerBody = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required()
})