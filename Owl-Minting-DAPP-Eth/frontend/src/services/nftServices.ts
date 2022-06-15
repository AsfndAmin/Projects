import NetworkService from "services/networkService";

class NftService {

    async mintRandomNft(data: any) {

        return await new NetworkService().callBackendEndpoint({
            method: "put",
            endpoint: "mint-random-nfts",
            data: data
        })
    }

    
    async getNftByTokenId(data) {

        return await new NetworkService().callBackendEndpoint({
            method: "post",
            endpoint: `nfts-by-token-id`,
            data: data
        })
    }


}

export default NftService;
