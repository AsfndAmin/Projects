const { nftsLeft } = require("../model/nft")
const conn = require("../../")


const channel = async (io:any) => {
        io.on('connect', async () => {
                console.log("connecting")
                const remaingNfts = await nftsLeft()
                conn.io.sockets.emit('nftsLeft', { nftsLeft: remaingNfts });
        })

}

export { channel } 