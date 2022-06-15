const mongoose = require("mongoose");

let owlsCategorySchema = mongoose.Schema(
    {
        story: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["BROWN AND FOOL'S GOLD",
                'REPTILIAN',
                'ROYAL PURPLE',
                '24K GOLD',
                'DIMOND ELITE'
                ],
            uppercase: true,
            trim: true,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const CategroyStory = mongoose.model("owlsCategoryStory", owlsCategorySchema);

export { CategroyStory }
