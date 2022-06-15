import { createSlice } from "@reduxjs/toolkit";


export const getCategoriesStorySlice = createSlice({
    name: "get categories story slice",
    initialState: {
        stories: null,
        success: false,
        storiesLoading: false,
        storiesError: false,
        storiesErrorMessage: null
    },
    reducers: {

        getStoriesRequest: (state, action) => {
            return {
                ...state,
                storiesLoading: true,
            }
        },
        getStoriesRequestSuccess: (state, action) => {
            return {
                ...state,
                storiesLoading: false,
                stories: action.payload.data,
                success: true,
            }
        },

        getStoriesRequestFailure: (state, action) => {
            return {
                ...state,
                storiesLoading: false,
                storiesError: true,
                storiesErrorMessage: action.payload.error
            }
        },
        resetGetStories: (state) => {
            return {
                ...state,
                stories: null,
                storiesLoading: false,
                storiesError: false,
                storiesErrorMessage: null
            }
        },
    }
});

export const { getStoriesRequest, getStoriesRequestSuccess, getStoriesRequestFailure } = getCategoriesStorySlice.actions;
export const getCategoriesStoryReducer = getCategoriesStorySlice.reducer;
