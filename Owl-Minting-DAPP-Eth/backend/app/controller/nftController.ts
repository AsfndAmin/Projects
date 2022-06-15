const { saveNft, mintNft,nftsLeft, nftByTokenId } = require("../model/nft")
const { nfts } = require('../data/nfts')
const conn = require('../../index')

const addnft = async (ctx: any) => {
    try {
        const data = await saveNft(nfts)
        if (data.error) throw data.error
        ctx.body = {
            response: 'success',
            status: 200,
            data: data
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

const mintRandomNft = async (ctx: any) => {
    try {
        const { quantity } = ctx.request.body
        const result = await mintNft(quantity)
        if (result.error) throw result.error
        const remaingNfts = await nftsLeft()
        conn.io.sockets.emit('nftsLeft', { nftsLeft: remaingNfts });
        ctx.body = {
            response: 'success',
            status: 200,
            data: result
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


const getNftByTokenId = async (ctx: any) => {
    try {

        const collection = ctx.request.body.collection
        const nfts = await nftByTokenId(collection);

        ctx.body = {
            response: "success",
            status: 200,
            data: nfts
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

export {
    addnft,
    mintRandomNft,
    getNftByTokenId
}