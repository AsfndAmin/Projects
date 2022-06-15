import { ToastMessage } from "components/common"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { checkAuthRequest } from "store/redux/slices/adminSlices/checkAuthSlice"
import { loginRequest, resetLogin } from "store/redux/slices/adminSlices/loginSlices"
import { useAppDispatch, useAppSelector } from "store/store"



export const LoginHook = () => {
    const { credentials, result, error, errorMessage, } = useAppSelector(state => state.login)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const login = () => {
        dispatch(loginRequest(credentials))
    }

    useEffect(() => {
        error && errorMessage.status === 505 && ToastMessage('Error', 'Something went Wrong, please refresh', 'error')
        result && dispatch(resetLogin()) && navigate('/stories')
    }, [error, result])

    return{
        login
    }
}

export const CheckAuthHook = ()=>{

    const dispatch = useAppDispatch()
    const token =localStorage.getItem('access_token')
    const {auth, loading, error, errorMessage} = useAppSelector((state: any)=> state.auth)

    useEffect(()=>{
       token && dispatch(checkAuthRequest(token))
    },[token])

    return{
        auth,
        loading,
        error,
        errorMessage
    }
}


