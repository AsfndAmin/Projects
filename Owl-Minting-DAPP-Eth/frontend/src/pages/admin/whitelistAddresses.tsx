import React, { useEffect, useState } from "react";
import "./admin.css";
import InputAddresses from "components/admin/inputAddress";
import UploadCsv from "components/admin/uploadCsv";
import AddressesList from "components/admin/addressesList";
import { useAppDispatch, useAppSelector } from "store/store";
import useForm from "hooks/useForm";
import { validateAddresses } from "components/validator";
import { AddWhiteListAddressesHook } from "hooks/whiteListAddressesHook";
import { MainModel, Button, Loader } from "components/common";
import { mainModel } from "store/redux/slices/helperSlices/modelSlice";
import { CheckAuthHook } from "hooks/adminHooks";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { whiteList, saveAddresses } = useAppSelector(
    (state: any) => state.addresses
  );
  const { web3, account } = useAppSelector((state) => state.web3Connect);
  const dispatch = useAppDispatch();
  const navigate =useNavigate()
  const {error} = CheckAuthHook()
  const token =localStorage.getItem('access_token')
  const { addAddresses, loading } = AddWhiteListAddressesHook();
  const [connectModel, setConnectModel] = useState(false);
  const { handleSubmit, errors, setErrors, setIsSubmitting, isSubmitting } =
    useForm(addAddresses, validateAddresses, { whiteList: whiteList });
  const handleModelOpen = () => {
    setConnectModel(true);
    dispatch(mainModel(true));
  };

  useEffect(()=>{
    (!token ||error) && navigate('/admin-login')
  },[error, token])

  return (
    <div style={{ backgroundColor: "black", padding: "1rem" }}>
      <MainModel connectModel={connectModel} />
      {web3 ? (
        <>
          {loading || saveAddresses.loading ? (
            <Loader content="Adding Addresses" />
          ) : (
            ""
          )}
          <InputAddresses />
          <UploadCsv />
          <AddressesList
            validate={validateAddresses}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setErrors={setErrors}
          />
          {errors.whiteList && (
            <p
              className="btn-add-addresses"
              style={{ color: "red", fontSize: "0.9rem" }}
            >
              *{errors.whiteList}
            </p>
          )}
          <div className="btn-add-addresses">
            <button
              disabled={saveAddresses.loading || loading ? true : false}
              onClick={handleSubmit}
              type="button"
            >
              {saveAddresses.loading || loading ? "Adding..." : "Add Addresses"}
            </button>
          </div>
        </>
      ) : (
        <Button connectWallet buttonCenter onClick={handleModelOpen}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Admin;
