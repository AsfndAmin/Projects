import React from "react";
import { useAppDispatch, useAppSelector } from "store/store";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { removeAddresses } from "store/redux/slices/addressSlice";
import { useEffect } from "react";

const AddressesList = ({
  setIsSubmitting,
  setErrors,
  validate,
  isSubmitting,
}: {
  isSubmitting: any;
  validate: any;
  setErrors: any;
  setIsSubmitting: any;
}) => {
  const { whiteList } = useAppSelector((state) => state.addresses);
  const dispatch = useAppDispatch();

  const removewhiteList = (i: number) => {
    const array = [...whiteList];
    const array1 = [...array.slice(0, i), ...array.slice(i + 1)];
    dispatch(removeAddresses(array1));
    setIsSubmitting(false);
  };

  useEffect(() => {
    setErrors(validate({ whiteList: whiteList }, false));
    setIsSubmitting(false);
  }, [whiteList]);

  return (
    <div className="div-addresses-list">
      {whiteList.length > 0 ? (
        <table className="tbl-addresses mt-5" style={{ color: "white" }}>
          <tbody>
            <tr>
              <th style={{ textAlign: "left" }}>WhiteList</th>
              <th style={{ textAlign: "right" }}>Remove</th>
            </tr>

          {whiteList?.map((data: any, i: number) => {
            return (
              <tr key={i}>
                <td style={{ textAlign: "left" }}>{data}</td>
                <td className="values">
                  <button
                    className="btn-remove-addresses"
                    onClick={() => removewhiteList(i)}
                  >
                    <RemoveCircleOutlineIcon />
                  </button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddressesList;
