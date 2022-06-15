import { all, takeLatest, put, takeEvery } from "redux-saga/effects"
import Nft from '../../services/nftServices'
import {getNftByTokenIdRequest, getNftByTokenIdRequestFailure, getNftByTokenIdRequestSuccess, mintRandomNftRequest, mintRandomNftRequestFailure, mintRandomNftRequestSuccess} from "../redux/slices/nftSlice"


function* mintRandomNftSaga(action:any): any {
    try {
        const res: any = yield new Nft().mintRandomNft(action.payload)

        if (!res?.data?.error) {
            yield put(mintRandomNftRequestSuccess(res.data))
        } else {
            yield put(mintRandomNftRequestFailure(res.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

function* getNftByTokenIdSaga(action: any): any {
    try {
        const result = yield new Nft().getNftByTokenId(action.payload)
        if (!result?.data?.error) {
            yield put(getNftByTokenIdRequestSuccess({ ...result.data }))
            //  yield put(resetGetNft())
        } else {
            yield put(getNftByTokenIdRequestFailure(result.data))
        }
    }
    catch (err) {
        console.log(err)
    }

}

export default all([
    takeLatest(mintRandomNftRequest.type, mintRandomNftSaga),
    takeLatest(getNftByTokenIdRequest.type, getNftByTokenIdSaga),
])


