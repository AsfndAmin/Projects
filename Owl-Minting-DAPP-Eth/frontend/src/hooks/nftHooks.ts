import openNotification from "components/common/toastMessage";
import { useEffect, useState } from "react";
import { getNftByTokenIdRequest, mintRandomNftRequest, resetMintRandomNfts } from "store/redux/slices/nftSlice";
import { useAppDispatch, useAppSelector } from "store/store";
import { CommonUtility } from "utility/common";
import { userCollectionAsync } from "utility/userCollection";


export const NftCountHook = () => {
    let socket: any;
    const [nftsLeft, setNftsLeft] = useState(0)

    useEffect(() => {
        socket = CommonUtility.socketIO()
    }, [])

    useEffect(() => {
        socket.on("connect_error", (err: any) => {
            console.log(`connect_error due to ${err}`);
        });
        socket && socket.on('nftsLeft', (result: any) => {
            setNftsLeft(result.nftsLeft)
        });
    }, [socket])

    return {
        nftsLeft
    }

}

export const MintNftHook = (setMintQuantity) => {
    const { mintRandomNfts } = useAppSelector(state => state.nft)
    const dispatch = useAppDispatch()

    const offChainMint = (quantity) => {
        dispatch(mintRandomNftRequest({ quantity }))
    }

    useEffect(() => {
        mintRandomNfts.result && dispatch(resetMintRandomNfts()) && setMintQuantity(0) && openNotification('Minted', 'Nfts Minted', 'success')
        mintRandomNfts.error && dispatch(resetMintRandomNfts()) && openNotification('Error', mintRandomNfts.errorMessage, 'error')
    }, [mintRandomNfts.result, mintRandomNfts.error])

    return {
        offChainMint,
        offChainMintLoading: mintRandomNfts.loading
    }

}


export const UserCollectionHook = () => {
    const [collection, setCollection] = useState(null)
    const [collectionLoading, setCollectionLoading] = useState(false)
    const [collectionError, setCollectionError] = useState()
    const { web3, account } = useAppSelector((state) => state.web3Connect);

    useEffect(() => {
        web3 && userCollectionAsync(account, setCollection, setCollectionLoading, setCollectionError)
    }, [web3])

    useEffect(() => {
        collection && setCollectionLoading(false)
    }, [collection])
    return {
        collection,
        collectionError,
        collectionLoading
    }

}

export const GetNftByTokenIdHook = () => {

    const { nftByTokenId } = useAppSelector((state) => state.nft);
    const dispatch = useAppDispatch()

    const getNfts = (tokenIds) => {
        dispatch(getNftByTokenIdRequest({ collection: tokenIds }))
    }

    useEffect(() => {

        if (nftByTokenId.error) {
            nftByTokenId.errorMessage.status == 505 && openNotification('Error', 'Somthing went wrong', 'error')
        }
    }, [nftByTokenId.error])

    return {
        getNfts,
        nftByTokenId
    }

}