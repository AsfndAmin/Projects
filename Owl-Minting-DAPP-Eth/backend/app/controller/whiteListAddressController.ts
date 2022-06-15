const { insertAddresses, findAddress } = require('../model/whitelistAddress')
const { whiteListAddress } = require('../utilities/addresses')


const saveAddresses = async (ctx: any) => {
    try {
        if (ctx.request.body.addresses.length < 1) throw 'Empty address list'
        console.log(ctx.request.body, "data7")
        const data = await insertAddresses(ctx.request.body)

        if (data.error) throw data.error

        ctx.body = {
            response: "success",
            status: 200,
            data
        }


    }
    catch (error) {
        console.log(error)
        ctx.body = {
            response: "failure",
            status: 505,
            error: error
        }
    }
}


const generateMerkleRoot = async (ctx: any) => {
    try {
        if (ctx.request.body.addresses.length < 1) throw 'Empty address list'

        const whitelistData = await whiteListAddress(ctx.request.body.addresses)

        if (whitelistData.error) throw 'Error adding addresses'

        ctx.body = {
            response: "success",
            status: 200,
            data: whitelistData
        }

    }
    catch (error) {
        console.log(error)
        ctx.body = {
            response: "failure",
            status: 505,
            error: error
        }
    }
}


const checkAddress = async (ctx: any) => {
    try {
        const address = ctx.request.query.address

        const data = await findAddress()
        if (data.error) throw data.error
        if (data) {
            const verified = data[data.length - 1].addresses.find((addr: any) => addr.address === address.toLocaleLowerCase().trim())

            if (data.error) throw data.error
            if (verified) {
                ctx.body = {
                    response: "success",
                    status: 200,
                    data: { verified: true, address: verified }
                }
            }
            else {
                ctx.body = {
                    response: "success",
                    status: 200,
                    data: { verified: false, address: null }
                }
            }
        }

        else {
            ctx.body = {
                response: "success",
                status: 200,
                data: { verified: false, address: null }
            }
        }
    }
    catch (error) {
        console.log(error)
        ctx.body = {
            response: "failure",
            status: 505,
            error: error
        }
    }
}

const getRootHash = async () => {
    try {
        const data = await findAddress()
        if (data.error) throw data.error
        return data[data.length - 1].root_hash
    }

    catch (error) {
        console.log(error)
    }
}

export {
    saveAddresses,
    checkAddress,
    getRootHash,
    generateMerkleRoot
}