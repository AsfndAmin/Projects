import { createSlice } from "@reduxjs/toolkit";


export const removeCategoriesStorySlice = createSlice({
    name: "get categories story slice",
    initialState: {
        result: null,
        error: false,
        errorMessage: null,
        loading: false
    },
    reducers: {

        removeStoryRequest: (state, action) => {
            return {
                ...state,
                loading: true,
            }
        },
        removeStoryRequestSuccess: (state, action) => {
            return {
                ...state,
                loading: false,
                result: action.payload.data
            }
        },

        removeStoryRequestFailure: (state, action) => {
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: action.payload
            }
        },
        resetRemoveStory: (state) => {
            return {
                ...state,
                result: null,
                error: false,
                errorMessage: null,
                loading: false
            }
        },
    }
});

export const { removeStoryRequest, removeStoryRequestFailure, removeStoryRequestSuccess, resetRemoveStory } = removeCategoriesStorySlice.actions;
export const removeCategoriesStoryReducer = removeCategoriesStorySlice.reducer;
