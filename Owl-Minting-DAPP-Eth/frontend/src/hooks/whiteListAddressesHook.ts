import openNotification from "components/custom/toastMessage/toastMessage"
import { useEffect, useState } from "react"
import { getProofRequest, removeAddresses, resetWhiteList, saveAddressesRequest } from "store/redux/slices/addressSlice"
import { useAppDispatch, useAppSelector } from "store/store"
import { setWhitelistMerkleRootWeb3 } from 'store/redux/slices/wallet3Connect/illuminatiContractWeb3Functions'
import WhitelistAddressService from "services/whitelistAddressService"
import { useNavigate } from "react-router-dom"

export const AddWhiteListAddressesHook = () => {
    const { whiteList, saveAddresses } = useAppSelector((state: any) => state.addresses)
    const { web3, account, owlMintingContract } = useAppSelector((state: any) => state.web3Connect)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('access_token')
    const navigate = useNavigate();

    const addAddresses = async () => {
        if (!token) {
            openNotification('Authentication Failed', 'Please login agian', 'warning')
            navigate('/admin-login')
        }
        else {
            setLoading(true)
            const data = {
                token,
                addresses: whiteList
            }
            const merkleRoot = await new WhitelistAddressService().generateMerkleRoot(data)
            if (!merkleRoot?.data?.error) {
                const { data } = merkleRoot.data
                console.log(data, owlMintingContract, "merkle root")
                const receipt = await setWhitelistMerkleRootWeb3(owlMintingContract, account, data.root_hash)

                if (receipt?.status) {
                    setLoading(false)
                    dispatch(saveAddressesRequest({ addresses: data.addresses, root_hash: data.root_hash, token }))
                }
                else {
                    setLoading(false)
                    openNotification('Error', "Transaction Failed", "error")
                }

            }
            else {
                if (merkleRoot.data.status === 401) {
                    openNotification('Authentication Failed', 'Please login agian', 'warning')
                    navigate('/admin-login')
                }
                setLoading(false)
                console.log(merkleRoot.data.error, "error creating merkle root")
                merkleRoot.data.status === 505 && openNotification('Error', "Error creating root", "error")
            }

        }

    }

    useEffect(() => {
        saveAddresses.result && dispatch(resetWhiteList()) && openNotification('Added', 'Addresses added to whiltelist', 'success')
        if( saveAddresses.error){
            saveAddresses.status == 401 && navigate('/admin-login')
            saveAddresses.status == 505 && openNotification('Error', 'Somthing went wrong', 'error')
        }
     
    }, [saveAddresses.result, saveAddresses.error])

    return {
        addAddresses,
        loading
    }
}


export const GetProofHook = () => {
    const { getProof } = useAppSelector((state: any) => state.addresses)
    const { web3, account } = useAppSelector((state) => state.web3Connect);
    const dispatch = useAppDispatch()

    useEffect(() => {
        web3 && account && dispatch(getProofRequest({ address: account }))
    }, [web3, account])


    return {
        data: getProof.result,
        error: getProof.error,
        errorMessage: getProof.errorMessage
    }
}