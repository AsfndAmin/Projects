import EthContract from "web3-eth-contract";

export const maxSupply = async (contract) => {
  try {
    const result = await contract.methods._maxSupply().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const mintFee = async (contract) => {
  try {
    const result = await contract.methods._mintFee().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const whitelistMintActive = async (contract) => {
  try {
    const result = await contract.methods.whitelistMintActive().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const publicMintActive = async (contract) => {
  try {
    const result = await contract.methods.publicMintActive().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const publicMintToggle = async (contract) => {
  try {
    const result = await contract.methods.publicMintToggle().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const whiteListMintToggle = async (contract) => {
  try {
    const result = await contract.methods.whiteListMintToggle().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};


export const mintToggleWeb3 = async (contract) => {
  try {
    const result = await contract.methods.mintToggle().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};


export const totalSupplyWeb3 = async (contract) => {
  try {
    const result = await contract.methods.totalSupply().call();
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

