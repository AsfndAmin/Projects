import { useEffect } from "react"
import { getFeeRequest } from "store/redux/slices/feeSlice"
import { useAppDispatch } from "store/store"




export const GetFeeHook =()=>{

    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(getFeeRequest())
    },[])

}