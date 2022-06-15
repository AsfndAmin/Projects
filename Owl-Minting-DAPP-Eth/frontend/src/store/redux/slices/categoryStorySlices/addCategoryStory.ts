import { createSlice } from "@reduxjs/toolkit";


export const categoryStorySlice = createSlice({
    name: "category slice slice",
    initialState: {
        story:{
            id:'',
            story:'',
            category:'',
            token:'',
            forUpdate: false
        },
        addStory: {
            result: null,
            error: false,
            errorMessage: null,
            loading: false
        },
        updateStory:{
            result: null,
            error: false,
            errorMessage: null,
            loading: false
        }
    },
    reducers: {

        setStory: (state, action) => {
            return {
                ...state,
                story: action.payload
            }
        },
        addStoryRequest: (state, action) => {
            return {
                ...state,
                addStory: {
                    ...state.addStory,
                    loading: true
                }
            }
        },
        addStoryRequestSuccess: (state, action) => {
            return {
                ...state,
                addStory: {
                    ...state.addStory,
                    loading: false,
                    result: action.payload.data
                }
            }
        },
        addStoryRequestFailure: (state, action) => {
            return {
                ...state,
                addStory: {
                    ...state.addStory,
                    loading: false,
                    error: true,
                    errorMessage: action.payload
                }
            }
        },
        updateStoryRequest: (state, action) => {
            return {
                ...state,
                updateStory: {
                    ...state.updateStory,
                    loading: true
                }
            }
        },
        updateStoryRequestSuccess: (state, action) => {
            return {
                ...state,
                updateStory: {
                    ...state.updateStory,
                    loading: false,
                    result: action.payload.data
                }
            }
        },
        updateStoryRequestFailure: (state, action) => {
            return {
                ...state,
                updateStory: {
                    ...state.updateStory,
                    loading: false,
                    error: false,
                    errorMessage: action.payload
                }
            }
        },
        resetAddStory: (state) => {
            return {
                ...state,
                addStory: {
                    result: null,
                    error: false,
                    errorMessage: '',
                    loading: false
                },
            }
        },
        resetUpdateStory: (state) => {
            return {
                ...state,
                updateStory:{
                    result: null,
                    error: false,
                    errorMessage: '',
                    loading: false
                }
            }
        },
        resetSetStory: (state) => {
            return {
                ...state,
                story:{
                    id:'',
                    story:'',
                    category:'',
                    token:'',
                    forUpdate: false
                }
            }
        },
    }
});

export const {resetAddStory,resetUpdateStory, addStoryRequest,addStoryRequestFailure,resetSetStory, addStoryRequestSuccess, setStory, updateStoryRequest, updateStoryRequestFailure, updateStoryRequestSuccess  } = categoryStorySlice.actions;
export const categoryStoryReducer = categoryStorySlice.reducer;
