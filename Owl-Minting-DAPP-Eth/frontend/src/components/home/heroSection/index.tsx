import React, { useState, useEffect } from "react";
import { MainHeroSection, HeroImg } from "./heroElement";
import {
  MainRow,
  MainContainer,
  MainCol,
  InputField,
  Button,
} from "components/common";
import cop_owl from "assets/images/cop_owl.png";
import { useAppDispatch, useAppSelector } from "store/store";
import { MainModel, ToastMessage, Loader } from "components/common";

import {
  publicMint,
  whitelistMint,
  mintToggleWeb3,
  totalSupplyWeb3,
} from "store/redux/slices/wallet3Connect/illuminatiContractWeb3Functions";

// redux Slice
import { mainModel } from "store/redux/slices/helperSlices/modelSlice";
import { MintNftHook, NftCountHook } from "hooks/nftHooks";
import { GetProofHook } from "hooks/whiteListAddressesHook";
import useFrom from "hooks/useForm";
import { validateQuantity } from "components/validator";

const HeroSection = () => {
  const [connectModel, setConnectModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const [mintFeeData, setMintFeeData] = useState<number>();
  const [quantity, setMintQuantity] = useState<number>(null);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [nftFee, setNftFee] = useState(0);
  const [proof, setProof] = useState<number>();
  const { nftsLeft } = NftCountHook();
  const { offChainMint, offChainMintLoading } = MintNftHook(setMintQuantity);
  const { data, error, errorMessage } = GetProofHook();
 

  const { fee, feeError, feeErrorMessage, feeLoading, feeSuccess } =
    useAppSelector((state) => state.fee);

  const { owlMintingContract, web3, account } = useAppSelector(
    (state) => state.web3Connect
  );
  const dispatch = useAppDispatch();

  const handleModelOpen = () => {
    setConnectModel(true);
    dispatch(mainModel(true));
  };

  useEffect(() => {
    if (web3 && account) {
      getUserBalance();
    }
  }, [web3, account]);

   

  // if user balance is les then minting fee then button will be disable

  useEffect(() => {
    if (fee && web3) {
      let nftFeeToNumber = fee / 10e17;
      setNftFee(nftFeeToNumber);
    }
  }, [web3, fee]);

  const getUserBalance = async () => {
    try {
      let balance: any = await web3?.eth.getBalance(account);
      balance = (balance / 10e17).toFixed(0).toString();
      
      setUserBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (web3 && account && nftFee) {
      if (userBalance > nftFee) {
        setIsDisabled(true);
      }
    }
  }, [web3, account, nftFee]);

  const mintQuantityFn = (e: any) => {
    if(e.target.value<0 || !e.target.value ){
      setMintQuantity(0);
    }
    else  {
      setMintQuantity(e.target.value.replace(/^0+/, ''));
    }
  };

  useEffect(() => {
    mintedToggleFn();
  }, [web3]);

  const mintedToggleFn = async () => {
    const mintedToggle = await mintToggleWeb3(owlMintingContract);
    console.log(mintedToggle);
  };

  useEffect(() => {
    const getTotalSupply = async () => {
      if (web3) {
        const supply = await totalSupplyWeb3(owlMintingContract);
        setTotalSupply(supply);
      }
    };
    getTotalSupply();
  }, [web3]);


  useEffect(() => {
    if (web3) {
      if (totalSupply === 3333) {
        setIsDisabled(true);
      }
    }
  }, [web3, totalSupply]);

  const submitMintNft = async () => {
    try {
      const mintedFee= (fee/10e17)*quantity
      let nftFeesRound = mintedFee.toFixed(5)
      let nftFeesDecimals = web3 ?  web3.utils.toWei(`${nftFeesRound}`, 'ether') : 0;
   
      const mintedToggle = await mintToggleWeb3(owlMintingContract);
      console.log(mintedToggle)
      if (mintedToggle) {
        setLoading(true);
        const mintedResult = await publicMint(
          owlMintingContract,
          account,
          quantity,
          nftFeesDecimals
        );
        
        if (mintedResult.status == true) {
          offChainMint(quantity);
          setLoading(false);
          ToastMessage(" ", "Public Nft Minted Successfully", "success");
        } else {
          setLoading(false);
          ToastMessage(" ", "Public Nft Minted Failed", "error");
        }
      } else {
        console.log('feeee1', mintedFee,)
        if (data?.verified) {
          setLoading(true);
          const whiteListMinted = await whitelistMint(
            owlMintingContract,
            account,
            quantity,
            data?.address.proof,
            nftFeesDecimals
          );

          if (whiteListMinted.status == true) {
            offChainMint(quantity);
            setLoading(false);
            ToastMessage(" ", "WhiteList Nft Minted Successfully", "success");
          } else {
            setLoading(false);
            ToastMessage(" ", "WhiteList Nft Minted Failed", "error");
          }
        } else ToastMessage(" Not verified", "Address not verified", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { handleSubmit, errors } = useFrom(submitMintNft, validateQuantity, {
    num: quantity,
    nftleft: nftsLeft,
  });

  return (
    <div>
      <MainModel connectModel={connectModel} />
      <MainHeroSection>
        <MainContainer>
          <MainRow>
            <MainCol lg={6}>
              <HeroImg src={cop_owl}></HeroImg>
            </MainCol>
            <MainCol lg={6}>
              {loading || offChainMintLoading ? (
                <Loader />
              ) : (
                <div className="heroRightCol">
                  <h2 className="price">
                    Total Price : {(quantity * fee) / 10e17}
                  </h2>
                  <h2 className="title">Owl to Mint</h2>
                  <InputField value={quantity} inputType="number" min={0} onChange={mintQuantityFn} />
                  {errors.num && (
                    <p
                      className="help is-danger"
                      style={{ color: "red", fontSize: "0.9rem" }}
                    >
                      *{errors.num}
                    </p>
                  )}
                  {web3 ? (
                    <Button
                      connectWallet
                      buttonCenter
                      isDisabled={isDisabled}
                      onClick={handleSubmit}
                    >
                      Buy Owls
                    </Button>
                  ) : (
                    <Button
                      connectWallet
                      buttonCenter
                      onClick={handleModelOpen}
                    >
                      Connect Wallet
                    </Button>
                  )}

                  {/* // nftFee = nftFee / 10e17 */}
                  <h3 className="mintPrice">Mint Price {fee / 10e17}</h3>
                  <h3 className="owls"> {nftsLeft} Owls Left</h3>
                </div>
              )}
            </MainCol>
          </MainRow>
        </MainContainer>
      </MainHeroSection>
    </div>
  );
};

export default HeroSection;
