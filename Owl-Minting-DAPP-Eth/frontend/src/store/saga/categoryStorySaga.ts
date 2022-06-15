import { all, takeLatest, put, takeEvery } from "redux-saga/effects"
import { getStoriesRequest, getStoriesRequestFailure, getStoriesRequestSuccess } from "store/redux/slices/categoryStorySlices/getCategoriesStory"
import { removeStoryRequest, removeStoryRequestFailure, removeStoryRequestSuccess } from "store/redux/slices/categoryStorySlices/removeCategoryStory"
import CategoryStoryService from "../../services/categoryStoryService"
import { 
    addStoryRequest,
    addStoryRequestFailure,
    addStoryRequestSuccess,
    updateStoryRequest,
    updateStoryRequestFailure,
    updateStoryRequestSuccess
 } from "../redux/slices/categoryStorySlices/addCategoryStory"

function* addStorySaga(action: any): any {
    try {
        const result: any = yield new CategoryStoryService().addStory(action.payload)
    
        if (!result?.data?.error) {
            yield put(addStoryRequestSuccess(result.data))
        } else {
            yield put(addStoryRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

function* updateStorySaga(action: any): any {
    try {
        const result: any = yield new CategoryStoryService().updateStory(action.payload)
    
        if (!result?.data?.error) {
            yield put(updateStoryRequestSuccess(result.data))
        } else {
            yield put(updateStoryRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

function* getStoriesSaga(action: any): any {
    try {
        const result: any = yield new CategoryStoryService().getStory(action.payload)
    
        if (!result?.data?.error) {
            yield put(getStoriesRequestSuccess(result.data))
        } else {
            yield put(getStoriesRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

function* removeStorySaga(action: any): any {
    try {
        const result: any = yield new CategoryStoryService().removeStory(action.payload)
    
        if (!result?.data?.error) {
            yield put(removeStoryRequestSuccess(result.data))
        } else {
            yield put(removeStoryRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

export default all([
    takeLatest(addStoryRequest.type, addStorySaga),
    takeLatest(updateStoryRequest.type, updateStorySaga),
    takeLatest(getStoriesRequest.type, getStoriesSaga),
    takeLatest(removeStoryRequest.type, removeStorySaga)
])