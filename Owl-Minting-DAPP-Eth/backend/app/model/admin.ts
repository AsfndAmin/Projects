const { Admin } = require("../schema/admin");
const SHA256 = require('crypto-js/sha256');


const insertCredentials = async () => {
    try {

        const data = await Admin.create({
            username: "javeria",
            password: JSON.stringify(SHA256("1234").words)
        })
        // console.log(data, "data")
        if (!data) throw "not inserted"
        else return data
    }
    catch (error) {
        console.log(error, "error")
        return { error }
    }
}

const getAdmin = async (ctx: any) => {
    try {

        const data = await Admin.find()
        console.log(data, "admin")
        if (!data) throw "not inserted"
        else return data
    }
    catch (error) {
        return {
            error: error
        }
    }
}

const deleteAdmin = async (ctx: any) => {
    try {

        const data = await Admin.deleteMany()

        if (!data) throw "not inserted"
        else ctx.body = {
            data: data
        }
    }
    catch (error) {
        ctx.body = {
            error: error
        }
    }
}

const userNameUpdate = async (id: string, user_name: any) => {
    try {
        const updated = await Admin.updateOne(
            { "_id": id },
            {
                $set: {
                    "user_name": user_name,
                }
            });
        return updated;
    }
    catch (error) {
        return { "error": error }
    }
};

const passwordUpdate = async (id: any, currentPass: string, newPassword: string) => {

    try {
        const data = await Admin.find({
            $and: [
                { "_id": id }
            ],
        });

        if (data[0].password != currentPass) {
            throw "Incorrect old password"
        }

        else {
            const updatedPassword = await Admin.updateOne(
                { "_id": id },
                {
                    $set: {
                        "password": newPassword
                    }
                });
            return updatedPassword;
        }
    }
    catch (error) {
        console.log(error)
        return { "error": error }
    }
};


export {
    insertCredentials,
    passwordUpdate,
    deleteAdmin,
    userNameUpdate,
    getAdmin
}