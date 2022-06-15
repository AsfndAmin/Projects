import { combineReducers } from "redux";

//nft imports

// Web3 Connect
import { web3Reducer } from "../redux/slices/wallet3Connect/web3ConnectSlice";
import { modelReducer } from "../redux/slices/helperSlices/modelSlice";

import { addressesReducer } from "./slices/addressSlice";
import { getFeeReducer } from "./slices/feeSlice";
import { nftReducer } from "./slices/nftSlice";
import { loginReducer } from "./slices/adminSlices/loginSlices";
import { checkAuthReducer } from "./slices/adminSlices/checkAuthSlice";
import { categoryStoryReducer } from "./slices/categoryStorySlices/addCategoryStory";
import { getCategoriesStoryReducer } from "./slices/categoryStorySlices/getCategoriesStory";
import { removeCategoriesStoryReducer } from "./slices/categoryStorySlices/removeCategoryStory";


const parentReducer = combineReducers({
  web3Connect: web3Reducer,
  model: modelReducer,
  addresses: addressesReducer,
  fee: getFeeReducer,
  nft: nftReducer,
  login: loginReducer,
  auth : checkAuthReducer,
  categoryStory: categoryStoryReducer,
  getCategoriesStory: getCategoriesStoryReducer,
  removeStory: removeCategoriesStoryReducer

});

export default parentReducer;
