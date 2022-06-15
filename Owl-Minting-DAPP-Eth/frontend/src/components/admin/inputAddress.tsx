import React, { useState } from "react";
import InputField from "components/custom/inputField/inputField";
import { setAddresses } from "store/redux/slices/addressSlice";
import { useAppDispatch } from "store/store";

const InputAddresses = () => {
  const dispatch = useAppDispatch();
  const [whitelist, setWhitelist] = useState("");

  const handleInputChange = (value: string) => {
    setWhitelist(value);
  };

  const saveAddresses = () => {
    dispatch(setAddresses(whitelist));
    setWhitelist("");
  };

  return (
    <div className="input-addresses-container">
      <div className="inputFields" style={{ color: "white" }}>
        <InputField
          name="whiteList"
          headerLabel="Set Addresses"
          value={whitelist}
          setValue={(value: any) => handleInputChange(value)}
          description="Press Enter key to save address"
          onKeyPress={saveAddresses}
          maxLength={42}
        />
      </div>
    </div>
  );
};

export default InputAddresses;
