import { createSlice } from "@reduxjs/toolkit";


export const NftSlice = createSlice({
    name: "nft slice",
    initialState: {
       mintRandomNfts:{
        result: null,
        error: false,
        errorMessage: '',
        loading: false
       },
       nftByTokenId:{
        result: null,
        error: false,
        errorMessage: null,
        loading: false
       }
    },
    reducers: {

        mintRandomNftRequest: (state, action) => {
            return {
                ...state,
                mintRandomNfts:{
                   ...state.mintRandomNfts,
                   loading: true
                   }
            }
        },

        mintRandomNftRequestSuccess: (state, action) => {
            return {
                ...state,
                mintRandomNfts:{
                    ...state.mintRandomNfts,
                    loading: false,
                    result: action.payload.data
                    }
            }
        },
        mintRandomNftRequestFailure: (state, action) => {
            return {
                ...state,
                mintRandomNfts:{
                    ...state.mintRandomNfts,
                    loading: false,
                    error: true,
                    errorMessage: action.payload.error
                    }
            }
        },
        resetMintRandomNfts: (state) => {
            return {
                ...state,
                mintRandomNfts:{
                    result: null,
                    error: false,
                    errorMessage: '',
                    loading: false
                    }
            }
        },
        getNftByTokenIdRequest: (state, action) => {
            return {
                ...state,
                nftByTokenId:{
                   ...state.nftByTokenId,
                   loading: true
                   }
            }
        },

        getNftByTokenIdRequestSuccess: (state, action) => {
            return {
                ...state,
                nftByTokenId:{
                    ...state.nftByTokenId,
                    loading: false,
                    result: action.payload.data
                    }
            }
        },
        getNftByTokenIdRequestFailure: (state, action) => {
            return {
                ...state,
                nftByTokenId:{
                    ...state.nftByTokenId,
                    loading: false,
                    error: true,
                    errorMessage: action.payload.error
                    }
            }
        },
        resetGetNftByTokenId: (state) => {
            return {
                ...state,
                nftByTokenId:{
                    result: null,
                    error: false,
                    errorMessage: null,
                    loading: false
                    }
            }
        }
    }
});

export const { getNftByTokenIdRequest, getNftByTokenIdRequestFailure, getNftByTokenIdRequestSuccess, resetGetNftByTokenId, mintRandomNftRequest,resetMintRandomNfts, mintRandomNftRequestSuccess, mintRandomNftRequestFailure } = NftSlice.actions;
export const nftReducer = NftSlice.reducer;
