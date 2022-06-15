const { mintedNfts, mintNft, UnMintNft, nftsLeft } = require("../model/nft");
const { contract } = require('../utilities/contractUtility');
const conn = require('../../index')


const web3CronJob = async () =>
{
    try
    {
        let nftCountFromBlockchain = await contract.methods
            .totalSupply()
            .call();

        let nftCountFromOffChain = await mintedNfts();


        if (Number(nftCountFromBlockchain) > nftCountFromOffChain.length)
        {
            let difference = Number(nftCountFromBlockchain) - nftCountFromOffChain.length
            const res = await mintNft(difference)
            const remaingNfts = await nftsLeft()

            console.log("onchain count:",nftCountFromBlockchain,
            "offchain count:",nftCountFromOffChain.length,"updated res:",res,"left:",remaingNfts,"onChain")

            conn.io.sockets.emit('nftsLeft', { nftsLeft: remaingNfts });
        }
        else if (Number(nftCountFromBlockchain) < nftCountFromOffChain.length)
        {
            let difference = nftCountFromOffChain.length - Number(nftCountFromBlockchain)
            const res = await UnMintNft(difference)
            const remaingNfts = await nftsLeft()

            console.log("onchain count:",nftCountFromBlockchain,
            "offchain count:",nftCountFromOffChain.length,"updated res:",res,"left:",remaingNfts,"offchain")

            conn.io.sockets.emit('nftsLeft', { nftsLeft: remaingNfts });
        }
        else console.log("onchain count:",nftCountFromBlockchain,
        "offchain count:",nftCountFromOffChain.length,"equal")
    } catch (error)
    {
        console.error(error);
        // ctx.body = { "error": error };
    }
};

export {web3CronJob };
