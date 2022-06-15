const Web3 = require("web3");
const { contract } = require('../utilities/contractUtility');

const getFee = async (ctx: any) => {
    try {
        let nftFee = await contract.methods
            ._mintFee()
            .call();

        // nftFee = nftFee / 10e17

        ctx.body = {
            response: "success",
            status: 200,
            data: { nftFee }
        }


    } catch (error) {
        console.error(error);
        ctx.body = {
            response: "failure",
            status: 505,
            error: error
        }
    }
};

export { getFee };
