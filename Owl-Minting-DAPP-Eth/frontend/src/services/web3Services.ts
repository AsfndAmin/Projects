import NetworkService from "./networkService";

class Web3Service {

    async getFee () {

        return await new NetworkService().callBackendEndpoint({
            method: "get",
            endpoint: "fee"
        })

    }   

}

export default Web3Service;
