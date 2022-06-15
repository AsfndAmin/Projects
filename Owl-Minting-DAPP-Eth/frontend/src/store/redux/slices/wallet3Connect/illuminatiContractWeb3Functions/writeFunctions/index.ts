import EthContract from "web3-eth-contract";

export const whitelistMint = async (contract, account, quantity, proof,fee) => {
  try {
    const result = await contract.methods
      .whitelistMint(quantity, proof)
      .send({ from: account, value:fee });
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const publicMint = async (contract, account, quantity,fee) => {
  try {
    const result = await contract.methods
      .publicMint(quantity)
      .send({ from: account,value:fee });
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const setBaseUri = async (contract, account, _baseUri) => {
  try {
    const result = await contract.methods
      .setBaseUri(_baseUri)
      .send({ from: account });
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const setMintingFee = async (contract, account: string, _fee) => {
  try {
    const result = await contract.methods
      .setMintingFee(_fee)
      .send({ from: account });
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const withdrawEth = async (contract, account: string, owner) => {
  try {
    const result = await contract.methods
      .withdrawEth(owner)
      .send({ from: account });
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};

export const setWhitelistMerkleRootWeb3 = async (
  contract,
  account: string,
  merkleRoot
) => {
  try {
    const result = await contract.methods
      .setWhitelistMerkleRoot(merkleRoot)
      .send({ from: account });
    return result;
  } catch (err) {
    console.log("Error ", err);
    return err;
  }
};


