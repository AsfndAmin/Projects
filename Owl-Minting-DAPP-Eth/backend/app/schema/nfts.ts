const mongoose = require("mongoose");


let nftSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            length: 300,
        },

        image: {
            type: String,
            required: true,
        },

        dna: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        edition: {
            type: String,
            // required: true,
            default: null
        },
        attributes: {
            type: String,
        },
        is_minted: {
            type: Boolean,
            // required: true,
            default: false

        },

        token_id: {
            type: Number,
            // required: true,
            default: null
        }
    },
    {
        timestamps: true,
    }
);
nftSchema.index({ token_id: 1 }, { unique: true });
const Nft = mongoose.model("owlMintingDappNfts", nftSchema);

export { Nft }