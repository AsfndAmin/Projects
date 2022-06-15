import React,{useState,useEffect} from "react";
import Navbar from "components/navbar";
import { Container, Row, Col } from "react-bootstrap";
import NftCard from "./nftCard";
import { UserNftPage } from "./element";
import { useAppDispatch, useAppSelector } from "store/store";
import { Button } from "components/common";
import { MainModel, ToastMessage, Loader } from "components/common";
import { mainModel } from "store/redux/slices/helperSlices/modelSlice";
import NftData from "../../data/nftData";
import { UserCollectionHook, GetNftByTokenIdHook } from "hooks/nftHooks";
 

const UserNftCom: React.FC = () => {
  const [connectModel, setConnectModel] = useState(false);
  const {nftByTokenId, getNfts} = GetNftByTokenIdHook()

  const { collection, collectionError, collectionLoading } =
    UserCollectionHook();


 useEffect(() => {
 collection && getNfts(collection.map((x)=> +x.token_id))
 }, [collection])
 
 console.log(collection, nftByTokenId,"data8");
  const dispatch=useAppDispatch();
  const { web3 } = useAppSelector((state) => state.web3Connect);
  const handleModelOpen = () => {
    setConnectModel(true);
    dispatch(mainModel(true));
  };

  return (
    <>
     <MainModel connectModel={connectModel} />
      <Navbar />
      {collectionLoading || nftByTokenId.loading? <Loader content="Collection Loading..." />:""}
      <UserNftPage>
        <Container>
          <Row>
            {!web3 ? (
              <Button connectWallet buttonCenter onClick={handleModelOpen}>
                Connect Wallet
              </Button>
            ) : (
            nftByTokenId?.result &&  nftByTokenId?.result?.map((item ) => (
                <Col lg={3} md={6}>
                  <NftCard item={item}   />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </UserNftPage>
    </>
  );
};

export default UserNftCom;
