import { all, takeLatest, put, takeEvery } from "redux-saga/effects"
import WhitelistAddressService from "../../services/whitelistAddressService"
import { saveAddressesRequest,resetWhiteList, saveAddressesRequestSuccess, saveAddressesRequestFailure, getProofRequest, getProofRequestSuccess, getProofRequestFailure, getMerkleRootRequest, getMerkleRootRequestSuccess, getMerkleRootRequestFailure } from "../redux/slices/addressSlice"

function* saveWhitelistAddressesSaga(action: any): any {
    try {
        const result: any = yield new WhitelistAddressService().saveAddresses(action.payload)
    
        if (!result?.data?.error) {
            yield put(saveAddressesRequestSuccess(result.data))
        } else {
            yield put(saveAddressesRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

function* getProofSaga(action: any): any {
    try {
        const result: any = yield new WhitelistAddressService().verifyAddress(action.payload)
    
        if (!result?.data?.error) {
            yield put(getProofRequestSuccess(result.data))
        } else {
            yield put(getProofRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

function* getMerkleRootSaga(action: any): any {
    try {
        const result: any = yield new WhitelistAddressService().generateMerkleRoot(action.payload)
    
        if (!result?.data?.error) {
            yield put(getMerkleRootRequestSuccess(result.data))
        } else {
            yield put(getMerkleRootRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}



export default all([
    takeLatest(saveAddressesRequest.type, saveWhitelistAddressesSaga),
    takeLatest(getProofRequest.type, getProofSaga),
    takeLatest(getMerkleRootRequest.type, getMerkleRootSaga)
])