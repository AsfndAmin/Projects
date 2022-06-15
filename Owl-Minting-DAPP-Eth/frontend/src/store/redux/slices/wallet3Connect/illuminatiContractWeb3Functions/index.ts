//read functions
export {
  maxSupply,
  mintFee,
  publicMintActive,
  publicMintToggle,
  mintToggleWeb3,
  whitelistMintActive,
  totalSupplyWeb3
} from "./readFunctions";

//write functions

export {
  publicMint,
  setBaseUri,
  setMintingFee,
  setWhitelistMerkleRootWeb3,
  whitelistMint,
  withdrawEth,
} from "./writeFunctions";
