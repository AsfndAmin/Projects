import React, { useEffect, useState } from "react";
import { HomeCom } from "components";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/store";
import { ToastMessage } from "components/common";
const Home = () => {
  const state = useAppSelector((state) => state);
  const { web3, chainId, web3ConnectingError } = state.web3Connect;
  console.log(web3, web3ConnectingError);
 

  return (
    <div>
      <HomeCom />
    </div>
  );
};

export default Home;
