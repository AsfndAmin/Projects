import React from "react"
import { useAppDispatch } from "store/store"
import UploadFile from "components/custom/uploadFile/uploadFile"
import { setAddresses } from "store/redux/slices/addressSlice"

const UploadCsv = () => {

    const dispatch = useAppDispatch();
   
    const saveAddress = (address: any) => {
        dispatch(setAddresses(address))
    }

    return (
        <div className="upload-csv-container">
            <label className="label" style={{color:"white"}}><b>Upload .csv File</b></label>
            <UploadFile saveAddress={saveAddress} />

        </div>
    )
}

export default UploadCsv