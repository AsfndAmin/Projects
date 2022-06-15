import NetworkService from "services/networkService";

class AdminService {

    async login(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "post",
            endpoint: "login",
            data: data
        })
    }
    async updatePassword(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "put",
            endpoint: "update-password",
            data: { new_password: data.new_password, current_password: data.current_password },
            headers: {
                'authorization': `Bearer ${data.token}`
            }
        })
    }


    async auth(token) {
        return await new NetworkService().callBackendEndpoint({
            method: "get",
            endpoint: "auth",
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
    }

    async updateUsername(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "put",
            endpoint: "update-username",
            data: { username: data.username },
            headers: {
                'authorization': `Bearer ${data.token}`
            }
        })
    }

    async logout(token) {
        return await new NetworkService().callBackendEndpoint({
            method: "post",
            endpoint: "blacklist_token",
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
    }

}

export default AdminService;
