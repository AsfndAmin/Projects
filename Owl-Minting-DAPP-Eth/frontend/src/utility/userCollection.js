import Moralis from 'moralis';
import env from "environment"
import { owlMintingContractAddress } from 'contract/owlMinting';
export const userCollectionAsync = async (userAddress, setCollection, setCollectionLoading, setCollectionError) => {
    try {
        setCollectionLoading(true)
        let userCollection= new Array();
        //avax mainnet
        // const serverUrl = "https://gddabju00piv.usemoralis.com:2053/server";
        // const appId = "nO8rkIXWlQqPMdG7WvdDTLERUTJbpNfryClZQRuZ";
        const serverUrl = "https://nbnob0befkpo.usemoralis.com:2053/server";
        const appId = "Cong0Rh8UwDPV5HC4U0nCPxiwEz5PAxeFLP2f3i0";
        Moralis.initialize(appId);
        Moralis.serverURL = serverUrl; 
        const options = {
            // chain: "avalanche", address: userAddress
            chain: "rinkeby", address: userAddress

        };
        const nfts = await Moralis.Web3.getNFTs(options);
        console.log("nfts",nfts)

        if (nfts.length != 0) {
            for (let i = 0; i < nfts.length; i++) {

                if (nfts[i].token_address == owlMintingContractAddress.toLocaleLowerCase()) {
                    userCollection.push(nfts[i])
                }
            }
        }
        setCollection(userCollection)
       
    }
    catch (error) {
        console.log("receipt", error)
        setCollectionError('Error getting nft collection')

    }
}
