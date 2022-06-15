
//validate values in body
const validate = async (ctx: any, next: any, keys: Array<string>) => {
    try {
        keys.map((key) => {
            if (!ctx.request.body[key]) throw `${key} is required`
        })
        return next()
    }

    catch (err) {
        return ctx.body = {
            response: "failure",
            status: 422,
            error: err
        }
    }

}


//validate values in params
const validateParams = async (ctx: any, next: any, keys: Array<string>) => {
    
    try {
        keys.map((key) => {
            if (!ctx.request.params[key]) throw `${key} is required`
        })
        return next()
    }

    catch (err) {
     
        return ctx.body = {
            response: "failure",
            status: 422,
            error: err
        }
    }

}



export {
    validate,
    validateParams
}