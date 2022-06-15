const { WhiteListAddresses } = require('../schema/whiteListAddersses')


const insertAddresses = async (whitelistData: Array<string>) => {

    try {
        const deletePrevious = await WhiteListAddresses.deleteMany()
        if (!deletePrevious) throw 'Something went wrong'

        if (deletePrevious) {
            const saved = await WhiteListAddresses.create(whitelistData)

            if (!saved) throw 'Addresses not added'

            return saved;

        }

    }
    catch (error) {
        console.log(error)
        return { error }
    }
}

const findAddress = async () => {
    try {

        const verified = await WhiteListAddresses.find()

        return verified

    }
    catch (error) {
        console.log(error)
        return { error }
    }
}


export {
    insertAddresses,
    findAddress
}