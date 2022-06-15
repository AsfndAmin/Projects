import { createSlice } from "@reduxjs/toolkit";


export const loginSlice = createSlice({
    name: "login user",
    initialState: {
        credentials: {
            username: "",
            password: ""
        },
        loading: false,
        error: false,
        errorMessage: null,
        result: null
    },
    reducers: {

        setCredentials: (state, action) => {
            return {
                ...state,
                credentials: { ...action.payload }
            }
        },
        loginRequest: (state, action) => {
            return {
                ...state,
                loading: true
            }
        },
        loginRequestSuccess: (state, action) => {
            console.log(action.payload,"payload")
            return {
                ...state,
                loading: false,
                result: action.payload.data
            }
        },
        loginRequestFailure: (state, action) => {
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: action.payload
            }
        },
        resetLogin: (state) => {
            return {
                ...state,
                credentials: {
                    username: "",
                    password: ""
                },
                loading: false,
                error: false,
                errorMessage: null,
                result: null
            }
        }
    }
});

export const { loginRequest,resetLogin, loginRequestSuccess, loginRequestFailure, setCredentials } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
