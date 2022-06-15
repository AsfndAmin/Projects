const { CategroyStory } = require("../schema/owlsCategoryStory");


const createStory = async ({ story, category }: { story: string, category: string }) => {
    try {

        const data = await CategroyStory.create({
            story,
            category: category.toLocaleUpperCase()
        })
        // console.log(data, "data")
        if (!data) throw "not inserted"
        else return data
    }
    catch (error) {
        console.log(error, "error")
        return { error }
    }
}

const findStory = async (categories: Array<string>) => {
    try {
        const data = await CategroyStory.find({ category: { $in: categories } })
        if (!data) throw "Error Getting Story"
        else return data
    }
    catch (error) {
        return {
            error: error
        }
    }
}

const deleteStory = async (id: string) => {
    try {

        const data = await CategroyStory.deleteOne({ '_id': id })

        if (!data) throw "Error deleting story"
        else return data
    }
    catch (error) {
        console.log(error, "error deleting category")
        return { error }
    }
}

const updateStory = async ({ id, story, category }: { id: string, story: string, category: string }) => {
    try {
        const updated = await CategroyStory.updateOne(
            { "_id": id },
            {
                $set: {
                    story,
                    category: category.toLocaleUpperCase()
                }
            });
        if (!updated) throw 'Error updating story'
        else return updated;
    }
    catch (error) {
        console.log(error, "error updating story")
        return { error }
    }
};


export {
    createStory,
    findStory,
    deleteStory,
    updateStory
}