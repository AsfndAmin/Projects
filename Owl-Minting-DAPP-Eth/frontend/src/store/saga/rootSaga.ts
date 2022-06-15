import { all } from "redux-saga/effects"
import adminSaga from "./adminSaga"
import categoryStorySaga from "./categoryStorySaga"
import feeSaga from "./feeSaga"
import nftSaga from "./nftSaga"
import whitelistAddressSaga from './whitelistAddressSaga'

export default function* rootSaga(): any {
    return yield all([
        whitelistAddressSaga,
        feeSaga,
        nftSaga,
        adminSaga,
        categoryStorySaga
    ])
}
