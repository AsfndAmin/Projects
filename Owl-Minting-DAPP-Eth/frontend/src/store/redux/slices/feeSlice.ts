import { createSlice } from "@reduxjs/toolkit";


export const getFeeSlice = createSlice({
    name: "get Fee slice",
    initialState: {
        fee: 0,
        feeLoading: false,
        feeSuccess: false,
        feeError: false,
        feeErrorMessage: null
    },
    reducers: {

        getFeeRequest: (state) => {
            return {
                ...state,
                feeLoading: true
            }
        },
        getFeeRequestSuccess: (state, action) => {
            return {
                ...state,
                feeLoading: false,
                fee: action.payload.data.nftFee,
                feeSuccess: true
            }
        },

        getFeeRequestFailure: (state, action) => {
            return {
                ...state,
                feeLoading: false,
                feeError: true,
                feeErrorMessage: action.payload.error
            }
        }
    }
});

export const { getFeeRequest, getFeeRequestSuccess, getFeeRequestFailure } = getFeeSlice.actions;
export const getFeeReducer = getFeeSlice.reducer;
