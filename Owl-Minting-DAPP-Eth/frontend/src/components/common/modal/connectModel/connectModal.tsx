import React from "react";
import {
  MainModel,
  ModelsData,
  ConnectButton,
  ConnectIcon,
} from "./connectModalElement";
import wallet from "assets/images/wallet.png";
import metamask from "assets/images/metamask.png";
import {
  loadBlockchain,
  loadWalletConnect,
} from "store/redux/slices/wallet3Connect/web3ConnectSlice";
import { useAppDispatch } from "store/store";

const ConnectModal = () => {
  const dispatch = useAppDispatch();

  const handleWeb3MetaMask = async () => {
    dispatch(loadBlockchain());
  };

  const handleWeb3WalletConnect = async () => {
    dispatch(loadWalletConnect());
  };

  return (
    <MainModel>
      <ModelsData>
        <ConnectButton
          onClick={() => handleWeb3MetaMask()}
          className="metamask-btn"
        >
          <ConnectIcon src={metamask} alt="icon" />
          Meta Mask
        </ConnectButton>

        <ConnectButton
          onClick={() => handleWeb3WalletConnect()}
          className="trustwallet-btn"
        >
          <ConnectIcon src={wallet} className="trustwallet-btn-img" />
          Wallet Connect
        </ConnectButton>
      </ModelsData>
    </MainModel>
  );
};

export default ConnectModal;
