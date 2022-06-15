const { Nft } = require("../schema/nfts");


//--create methods--

// saveNft
const saveNft = async (array: Array<object>) => {
    try {
        const saveNftDataIntoDb = await Nft.insertMany(array)

        if (!saveNftDataIntoDb) throw 'Something went wrong'

        return saveNftDataIntoDb;
    }
    catch (error) {

        console.log(error)
        return { "error": error }
    }

}

//--find methods--


//nfts left
const nftsLeft = async () => {
    try {
        const nftsLeft = await Nft.find(
            { is_minted: false }

        ).count();
        console.log("nftsLeft", nftsLeft)
        return nftsLeft;
    }
    catch (error) {
        return { "error": error }
    }
};

const mintedNfts = async () => {
    try {
        const mintedNfts = await Nft.find({
            $and: [
                { is_minted: true },
            ],
        }).sort({ token_id: "asc" });

        return mintedNfts;
    }
    catch (error) {
        return { "error": error }
    }

};

const nftByTokenId = async (collection: any) => {
    try {
        console.log("getting nft start")

        const nfts = await Nft.find({token_id: {$in: collection}})
        console.log("getting nft ")
        return nfts
    }
    catch (error) {
        console.log(error, "error")
        return { "error": error }
    }
};


//update methods

const mintNft = async (num: number) => {
    try {
        const number = Number(num)
        const randomNft = await Nft.find({
            $and: [{ is_minted: false }],
        }).sort({ token_id: 1 }).limit(number);
       
        const update = await Nft.updateMany(
            { token_id: { $in: randomNft.map((nft: any) => nft.token_id) } },
            { is_minted: true }
        )

        return update;
    }
    catch (error) {
        return { "error": error }
    }
};


const UnMintNft = async (num:number) => {
    try {
        const number = Number(num)
        const randomNft = await Nft.find({
            $and: [{ is_minted: true }],
        }).sort({ token_id: -1 }).limit(number);

        const update = await Nft.updateMany(
            { token_id: { $in: randomNft.map((nft: any) => nft.token_id) } },
            { is_minted: false }
        )

        return update;
    }
    catch (error) {
        return { "error": error }
    }
};


export {
    saveNft,
    nftsLeft,
    mintNft,
    mintedNfts,
    UnMintNft,
    nftByTokenId
};
