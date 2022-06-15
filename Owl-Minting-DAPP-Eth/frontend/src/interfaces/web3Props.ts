import EthContract from "web3-eth-contract";
import Web3 from "web3";

export type StateType = {
  web3: null | Web3;
  owlMintingContract: null | EthContract.Contract;
  owlMintingContractAddress: string;
  account: string;
  web3LoadingErrorMessage: string;
  web3Loading: boolean;
  web3ConnectingError: string;
  ErrorMessage: string;
  chainId: number | null
  
};

export type Web3ConnectPayloadType = {
  web3: Web3;
  account: string;
  web3Loading: boolean;
  owlMintingContract: null | EthContract.Contract;
  owlMintingContractAddress: string;
  web3LoadingErrorMessage: string;
  chainId: number;
  web3ConnectingError: string;

};
