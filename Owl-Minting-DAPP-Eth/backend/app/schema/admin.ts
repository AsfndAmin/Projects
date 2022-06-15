const mongoose = require("mongoose");

let adminSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            length: 300,
        },
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.model("owlMintingDappAdmin", adminSchema);

export { Admin }
