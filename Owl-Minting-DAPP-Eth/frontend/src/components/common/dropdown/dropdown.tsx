import React from "react";
import { NftForms } from "../InputField/inputElement";
import { DropdownsMenu, Dropdowns } from "./dropdownElements";
import { Button } from "components/common";

type Props = {
  createCategoryBtn?: boolean;
  inputLabel?: string;
  inputLabelText?: string;
  inputRequired?: boolean;
  value: string;
  setValue: any;
  options: Array<any>,
  error: string;
};
const Dropdown: React.FC<Props> = ({
  inputLabel,
  inputLabelText,
  inputRequired,
  value,
  setValue,
  options,
  error,
}: {
  inputLabel?: string;
  inputLabelText?: string;
  inputRequired?: boolean;
  value: string;
  setValue: any;
  error?: string;
  options: Array<any>;
}) => {
  const menu = (
    <DropdownsMenu
      vocab={value}
      onChange={(e) => {
        console.log(e, "data8");
        setValue(e);
      }}
    >
      <DropdownsMenu.Item>item1</DropdownsMenu.Item>
      <DropdownsMenu.Item>item2</DropdownsMenu.Item>
      <DropdownsMenu.Item>item3</DropdownsMenu.Item>
    </DropdownsMenu>
  );

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
        <br />
        <NftForms.Text className="text-muted">{inputLabelText}</NftForms.Text>
        <br />
        <select value={value} onChange={(e) => setValue(e)}>
          <option value="" selected disabled hidden>{inputLabelText}</option>
          {options.map((option, i) => {
           return <option key={i} value={option.value}>{option.text}</option>;
          })}
        </select>
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

export default Dropdown;
