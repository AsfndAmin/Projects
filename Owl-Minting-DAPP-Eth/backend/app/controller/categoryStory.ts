const {createStory,findStory,deleteStory,updateStory} = require('../model/owlsCategoryStory')

const addStory = async (ctx: any) => {
    try {
        const data = await createStory(ctx.request.body)
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

const getStory = async (ctx: any) => {
    try {
        const categories = JSON.parse(ctx.request.query.categories)
        const data = await findStory(categories)
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


const removeStory = async (ctx: any) => {
    try {
        const data = await deleteStory(ctx.request.query.id)
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

const storyUpdate = async (ctx: any) => {
    try {
        const data = await updateStory(ctx.request.body)
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

export{
    addStory,
    storyUpdate,
    getStory,
    removeStory,

}