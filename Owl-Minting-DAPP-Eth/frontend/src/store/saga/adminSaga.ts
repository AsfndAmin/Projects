import { all, takeLatest, put } from "redux-saga/effects"
import AdminService from "services/adminService"
import { checkAuthRequest, checkAuthRequestFailure, checkAuthRequestSuccess, resetcheckAuth } from "store/redux/slices/adminSlices/checkAuthSlice";
import { loginRequest, loginRequestFailure, loginRequestSuccess, resetLogin } from "store/redux/slices/adminSlices/loginSlices";

 

function* loginSaga(action: any): any {
    try {
        console.log(action.payload,"saga")
        const loginRes = yield new AdminService().login(action.payload)

        if (!loginRes?.data?.error) {
            localStorage.setItem("access_token", loginRes.data.data.token);
            yield put(loginRequestSuccess(loginRes.data))
        } else {
            yield put(loginRequestFailure(loginRes.data))
        }
    }
    catch (err) {
        console.log(err)
    }
}
 
function* checkAuthSaga(action: any): any {
    try {
        const res = yield new AdminService().auth(action.payload)
        if (!res?.data?.error) {
            yield put(checkAuthRequestSuccess(res.data))
        } else {
            yield put(checkAuthRequestFailure(res.data))
        }
    }
    catch (err) {
        console.log(err)
    }
}

export default all([
    takeLatest(loginRequest.type, loginSaga),
    takeLatest(checkAuthRequest.type, checkAuthSaga)
])

 