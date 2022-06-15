const mongoose = require("mongoose");


let whiteListAddressesSchema = mongoose.Schema(
    {
        addresses: {
            type: Array,
            required: true,
        },
        root_hash:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const WhiteListAddresses = mongoose.model("owlWhiteListAddresses", whiteListAddressesSchema);
export {WhiteListAddresses }

