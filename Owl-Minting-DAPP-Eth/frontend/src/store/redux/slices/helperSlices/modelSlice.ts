import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialState = {
  collapsed: null,
  modelOpen: null,
};

export const collapsedDashboard: any = createAsyncThunk(
  "collapsedDashboard",
  async (collapsed: any, thunkAPI) => {
    try {
      const result = collapsed;
      return result;
    } catch (error) {
      console.log("Error");
      return error;
    }
  }
);

export const mainModel: any = createAsyncThunk(
  "connectModel",
  async (modelOpen: any, thunkAPI) => {
    try {
      const result = modelOpen;
      return result;
    } catch (error) {
      console.log("Error");
      return error;
    }
  }
);

const modelSlice = createSlice({
  name: "ModalSlide",
  initialState,
  reducers: {},
  extraReducers: {
    [collapsedDashboard.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction
    ) => {
      state.collapsed = payload;
    },
    [mainModel.fulfilled.toString()]: (state, { payload }: PayloadAction) => {
      state.modelOpen = payload;
    },
  },
});

export const modelReducer = modelSlice.reducer;
