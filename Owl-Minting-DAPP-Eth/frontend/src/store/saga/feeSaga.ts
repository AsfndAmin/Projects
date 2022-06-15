import { all, takeLatest, put, takeEvery } from "redux-saga/effects"
import Web3Service from '../../services/web3Services'
import {getFeeRequestFailure, getFeeRequestSuccess, getFeeRequest} from "../redux/slices/feeSlice"


function* getFeeSaga(): any {
    try {
        const getFeeRes: any = yield new Web3Service().getFee()

        if (!getFeeRes?.data?.error) {
            yield put(getFeeRequestSuccess(getFeeRes.data))
        } else {
            yield put(getFeeRequestFailure(getFeeRes.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

export default all([
    takeLatest(getFeeRequest.type, getFeeSaga),
])


