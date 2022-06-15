import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
  import WalletConnectProvider from '@walletconnect/web3-provider'
import EthContract from 'web3-eth-contract'

import {
  owlMintingContractAddress,
  owlMintingContractAbi,
} from 'contract/owlMinting'

import { StateType, Web3ConnectPayloadType } from 'interfaces/web3Props'

export const initialState: StateType = {
  web3: null,
  chainId: null,
  owlMintingContract: null,
  owlMintingContractAddress: null,

  account: null,
  web3LoadingErrorMessage: '',
  web3Loading: false,
  ErrorMessage: "",
  web3ConnectingError: ""
};

export const loadBlockchain = createAsyncThunk(
  'loadwalletcoonnect',
  async (_, thunkAPI) => {
    try {
      console.log('Web3.givenProvider.chainId', Web3.givenProvider.chainId)

      if (Web3.givenProvider ) {
        await Web3.givenProvider.enable()
        const web3 = new Web3(Web3.givenProvider)
        let account: any = await web3.eth.getAccounts()
        account = account[0]
        let chainId: number = await web3.eth.getChainId()
        const owlMintingContract: EthContract.Contract = new web3.eth.Contract(
          owlMintingContractAbi as AbiItem[],
          owlMintingContractAddress,
        )

        return {
          web3,
          account,
          owlMintingContract,
          chainId,
        }
      } else {
        console.log('error connecting to metamask')
        return {
          web3LoadingErrorMessage: 'error connecting to metamask',
        }
      }
    } catch (err) {
      //  when user reject the request then error code and message returned from metamask
      let connectErrorMsg;
      console.log(err)
       if (err &&  err.code)
       {
          connectErrorMsg="User Rejected The Request"
       }
       else 
       {
        connectErrorMsg="Metamask Error Please Download Metamask We are redirecting you to metamask website"
 
       }
      return {
        web3ConnectingError: connectErrorMsg
      }
    }
  },
)

// Connect with Wallet of users choice
export const loadWalletConnect = createAsyncThunk(
  'LoadWalletConnect',
  async (_, thunkAPI) => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
        },
        chainId: 56,
      })
      console.log('Provider', provider)
      if (provider) {
        await provider.enable()
        const web3 = new Web3(provider as any)
        console.log('web3 state', web3)
        let account: any = await web3.eth.getAccounts()
        account = account[0]
        let chainId: number = await web3.eth.getChainId()
        return {
          web3,
          account,
          chainId,
        }
      } else {
        return {
          web3LoadingErrorMessage:
            'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!',
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
)

const web3ConnectSlice = createSlice({
  name: 'Web3Connect',
  initialState,
  reducers: {
    updateAccount: (state, { payload }) => {
      console.log('account', payload?.account)
      state.account = payload?.account
    },
  },
  extraReducers: {
    [loadWalletConnect.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<Web3ConnectPayloadType>,
    ) => {
      console.log('payloadpayload', payload)
      state.web3 = payload?.web3
      state.account = payload?.account
      state.web3Loading = false
      state.owlMintingContract = payload?.owlMintingContract
      state.chainId = payload?.chainId
      state.owlMintingContractAddress = payload?.owlMintingContractAddress
      
       state.web3LoadingErrorMessage = payload?.web3LoadingErrorMessage
       state.web3ConnectingError = payload?.web3ConnectingError
    },
    [loadBlockchain.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<Web3ConnectPayloadType>,
    ) => {
      state.web3 = payload?.web3
      state.account = payload?.account
      state.web3Loading = false
      state.owlMintingContract = payload?.owlMintingContract
      state.owlMintingContractAddress = payload?.owlMintingContractAddress
      state.web3LoadingErrorMessage = payload?.web3LoadingErrorMessage
      state.chainId = payload?.chainId
      state.web3ConnectingError = payload?.web3ConnectingError

    },
  },
})

export const web3Reducer = web3ConnectSlice.reducer
export const { updateAccount } = web3ConnectSlice.actions
