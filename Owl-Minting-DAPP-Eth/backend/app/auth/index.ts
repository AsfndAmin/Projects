const jwt = require("jsonwebtoken")
const SHA256 = require('crypto-js/sha256');
const { Admin } = require("../schema/admin");
const { environment } = require("../../environment")
const {generateHashPass} =require('../utilities/common')


const adminLogin = async (ctx: any) => {
    try {
        const { username, password } = ctx.request.body
        const data = await Admin.find({
            $and: [{ username: username }]
        });

        if (data.length == 0) {
            ctx.body = {
                response: "failure",
                status: 404,
                error: "user name not found"
            }
        }

        else {
            if (data[0].password != generateHashPass(password)) {
                ctx.body = {
                    response: "failure",
                    status: 401,
                    error: "password is incorrect"
                }
            }
            else {
                const token = jwt.sign({ id: data[0]._id }, JSON.stringify(SHA256(environment.ADMIN_TOKEN).words), { expiresIn: '1d' });
               // auth(JSON.stringify(SHA256(environment.ADMIN_TOKEN).words))
                ctx.body = {
                    response: "success",
                    status: 200,
                    data: { token: token }
                }
            }
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

const checkAuth = async (ctx: any) => {
    ctx.body = {
        response: "success",
        status: 200,
        auth: true
    }
}

export {
    adminLogin,
    checkAuth
}