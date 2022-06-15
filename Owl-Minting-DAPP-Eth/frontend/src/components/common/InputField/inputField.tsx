import React from "react";
import { NftForms, FormControl } from "./inputElement";

const InputField = ({
  inputLabel,
  inputLabelText,
  inputRequired,
  inputType,
  placeholder,
  value,
  setValue,
  maxLength,
  disabled,
  onChange,
  error,
  min,
}: {
  inputLabel?: string;
  inputLabelText?: string;
  inputRequired?: boolean;
  inputType: string;
  min?: number;
  inputLinks?: boolean;
  placeholder?: string;
  inputValue?: string;
  disabled?: boolean;
  error?: string;
  value?: string | any;
  setValue?: any;
  maxLength?: number;
  onChange?: any;
  onClick?: (event: React.MouseEvent) => void;
}) => {
  return (
    <div>
      <NftForms.Group>
        <NftForms.Label style={{ marginTop: "1rem", color: "white" }}>
          {" "}
          {inputLabel}
          {inputRequired ? (
            <span
              style={{ color: "red", marginLeft: "0.2rem", marginTop: "5rem" }}
            >
              *
            </span>
          ) : (
            ""
          )}
        </NftForms.Label>
        <NftForms.Text className="text-muted">{inputLabelText}</NftForms.Text>

        <FormControl
          type={inputType}
          // disabled={disabled}
          onChange={onChange}
          value={value}
          min={min}
          placeholder={placeholder}
        ></FormControl>
         {error && (
          <p
            className="help is-danger"
            style={{ color: "red", fontSize: "0.9rem" }}
          >
            *{error}
          </p>
        )}
      </NftForms.Group>
      
    </div>
  );
};

export default InputField;
