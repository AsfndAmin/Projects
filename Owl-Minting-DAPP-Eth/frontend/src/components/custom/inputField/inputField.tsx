import { useState } from "react";
import "./inputField.css"



const InputField = ({ headerLabel, value, setValue, onKeyPress, description, error, name, type = "text", maxLength }: { onKeyPress?:any, value:any, error?: string, setValue?: any, headerLabel?: string, name: string, description?: string, type?: "text" | "number" | "password", maxLength?: number }) => {


    const maxLengthCheck = (object: any) => {
        if ( maxLength && object.target.value.length > maxLength) {
            let value = object.target.value.slice(0, maxLength)
            setValue(value);
        }
    }
    
    return (
        <div className="input-container">
            <label className="label"><b>{headerLabel}</b></label>
            <label style={{ float: "right", fontSize: "11px" }} className="label">{maxLength  ? `${value.length} / ${maxLength}` : ""}</label>
            <p style={{fontSize:'0.8rem', margin:'0px 2px 2px 0px'}}>
               <i> {description}</i>
            </p>
            <input
                id="filled-password-input"
                type={type}
                style={{
                    color:"red"
                }}
                name={name}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    maxLengthCheck(e);
                    
                }}
                className="input"
                autoComplete="current-password"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        onKeyPress()
                    }
                }}
            />
           
            {error && (
                <p className="help is-danger" style=
                    {{ color: 'red', fontSize: "0.9rem" }} >*{error}</p>
            )}
        </div>
    );
};

export default InputField;