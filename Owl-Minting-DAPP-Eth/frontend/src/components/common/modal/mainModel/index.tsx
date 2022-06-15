import React, { useEffect, useState } from "react";

import {
  ConnectModel,
   
} from "components/common/modal";

import { Modal } from "antd";
import { useAppDispatch, useAppSelector } from "store/store";

import { mainModel } from "store/redux/slices/helperSlices/modelSlice";

const MainModel = ({
  connectModel,
  
}: {
  connectModel?: any;
   
 


  
}) => {
 

  const [modal1Visible, setModal1Visible] = useState(false);

  const { web3 } = useAppSelector((state) => state.web3Connect);
  const { modelOpen } = useAppSelector((state) => state.model);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (modelOpen) {
      setModal1Visible(true);
    }
  }, [modelOpen]);

  const closeModel = () => {
    dispatch(mainModel(false));
    setModal1Visible(false);
  };

  return (
    <div>
      {web3 === null && connectModel ? (
        <Modal
          destroyOnClose={true}
          style={{ top: 20 }}
          visible={modal1Visible}
          centered
          onCancel={closeModel}
        >
          <ConnectModel />
        </Modal>
      ) : null}
 

      
    </div>
  );
};

export default MainModel;
