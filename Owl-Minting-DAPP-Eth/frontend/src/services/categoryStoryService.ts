import NetworkService from "services/networkService";

class CategoryStoryService {

    async addStory(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "post",
            endpoint: "add-story",
            data: {story: data.story, category: data.category},
            headers: {
                'authorization': `Bearer ${data.token}`
            }
        })
    }
    async getStory(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "get",
            endpoint: "get-story",
            params: {categories: data.categories}
        })
    }


    async updateStory(data) {
        return await new NetworkService().callBackendEndpoint({
            method: "put",
            endpoint: "update-story",
            data:{id: data.id, category: data.category, story:data.story},
            headers: {
                'authorization': `Bearer ${data.token}`
            }
        })
    }

    async removeStory(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "delete",
            endpoint: "remove-story",
            params: { id: data.id },
            headers: {
                'authorization': `Bearer ${data.token}`
            }
        })
    }

  

}

export default CategoryStoryService;
