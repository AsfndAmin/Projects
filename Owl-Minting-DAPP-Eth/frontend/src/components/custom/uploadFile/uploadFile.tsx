import React, { useRef } from "react";
import UploadIcon from "assets/icons8-upload-64.png";
import Papa from "papaparse";
import "./uploadFile.css";
import templateCsv from "data/templatecsv.csv";

const FileUPload = ({ saveAddress }: { saveAddress: any }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerFileSelectPopup = (event: any) => {
    inputRef.current?.click();
  };
  const onSelectFile = async (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
      if (files) {
        Papa.parse(files[0], {
          skipEmptyLines: true,
          complete: function (results) {
            results.data.map((array: any, i) => {
              saveAddress(array[0]);
              event.target.value = null;
            });
          },
        });
      }
    }
  };

  return (
    <div className="upload-container">
      <img width="64x" src={UploadIcon} />
      <p style={{ color: "white" }} className="mt-3">
        Only .csv files are allowed,{" "}
        <a href={templateCsv} download={true}>
          Download Template File
        </a>
      </p>
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        id="p1"
        onChange={onSelectFile}
        name="photo"
        style={{ display: "none" }}
      />
      <div className="div-btn-upload">
        <button
          className="btn-upload"
          onClick={(event: any) => triggerFileSelectPopup(event)}
        >
          Choose CSV
        </button>
      </div>
    </div>
  );
};

export default FileUPload;
