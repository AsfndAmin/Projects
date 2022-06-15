const { passwordUpdate, userNameUpdate, insertCredentials } = require("../model/admin");
const jwt = require("jsonwebtoken")
const SHA256 = require('crypto-js/sha256');
const { environment } = require("../../environment")
const { generateHashPass } = require('../utilities/common')



const createCredentials = async (ctx: any) => {
    try {
        const result = await insertCredentials();
        if(result.error) throw result.error
         ctx.body = {
            response: "success",
            status: 200,
            data: result
        }
    }
    catch (error) {
        console.log(error, "error")
        ctx.body = {
            response: "failure",
            status: 401,
            error: error
        }
    }
}

const updatePassword = async (ctx: any) => {
    try {

        const { new_password, current_password } = ctx.request.body
        const theToken = ctx.request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, JSON.stringify(SHA256(environment.ADMIN_TOKEN).words));
        const currentEncryptPass = generateHashPass(current_password)
        const newEncryptedPass = generateHashPass(new_password)
        const updated = await passwordUpdate(decoded.id, currentEncryptPass, newEncryptedPass)

        if (updated.error) {
            throw updated.error
        }

        else ctx.body = {
            response: "success",
            status: 200,
            data: updated
        }
    }
    catch (error) {
        // return error
        ctx.body = {
            response: "failure",
            status: 401,
            error: error
        }
    }
};

const updateUserName = async (ctx: any) => {
    try {
        const theToken = ctx.request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, JSON.stringify(SHA256(environment.ADMIN_TOKEN).words));
        const userName = ctx.request.body.username
        const result = await userNameUpdate(decoded.id, userName)

        if (result.error) throw result.error

        ctx.body = {
            response: "success",
            status: 200,
            data: result
        }
    }

    catch (error) {

        ctx.body = {
            response: "failure",
            status: 505,
            error: error
        }

    }
}



export {
    updatePassword,
    updateUserName,
    createCredentials
};
