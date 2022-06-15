import { createSlice } from "@reduxjs/toolkit";


export const checkAuthSlice = createSlice({
    name: "check auth",
    initialState: {
        loading: false,
        error: false,
        errorMessage: null,
        auth: null
    },
    reducers: {
        checkAuthRequest: (state, action) => {
            return {
                ...state,
                loading: true,
                error: false,
                errorMessage: false,
                auth: null
            }
        },
        checkAuthRequestSuccess: (state, action) => {
            return {
                ...state,
                loading: false,
                auth: action.payload.auth,
            }
        },
        checkAuthRequestFailure: (state, action) => {
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: action.payload.error
            }
        },
        resetcheckAuth: (state) => {
            return {
                ...state,
                loading: false,
                error: false,
                errorMessage: null,
                auth: null
            }
        }

    }
});

export const { checkAuthRequest, checkAuthRequestFailure, resetcheckAuth, checkAuthRequestSuccess } = checkAuthSlice.actions;
export const checkAuthReducer = checkAuthSlice.reducer;
