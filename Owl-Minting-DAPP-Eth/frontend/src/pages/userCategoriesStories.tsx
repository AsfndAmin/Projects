import { GetStoriesHook } from "hooks/categoryStories";

import { MainModel, Button, Loader } from "components/common";
import { mainModel } from "store/redux/slices/helperSlices/modelSlice";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/store";
import { GetNftByTokenIdHook, UserCollectionHook } from "hooks/nftHooks";
import { CommonUtility } from "utility/common";

const UserCategroiesStory = () => {
  const { getStory, storiesLoading, stories } = GetStoriesHook();
  const { collection, collectionLoading } = UserCollectionHook();
  const { getNfts, nftByTokenId } = GetNftByTokenIdHook();
  const [connectModel, setConnectModel] = useState(false);
  const dispatch = useAppDispatch();
  const { web3, account } = useAppSelector((state) => state.web3Connect);


  const handleModelOpen = () => {
    setConnectModel(true);
    dispatch(mainModel(true));
  };

  useEffect(() => {
    const story = () => {
      const { result } = nftByTokenId;
      const categories = result.map((nft) => {
        const attributes = JSON.parse(nft?.attributes);
        const type = attributes.find((x) => x.trait_type == "Owl Type");
        if (type.value === "Brown" || type.value === "Fool's Gold") {
          return "BROWN AND FOOL'S GOLD";
        } else return type.value.toUpperCase();
      });
      const types: any = new Set(categories);
      getStory([...types]);
    };
    nftByTokenId.result && story();
  }, [nftByTokenId.result]);

  useEffect(() => {
    collection && getNfts(collection.map((x) => +x.token_id));
  }, [collection]);

  return (
    <div style={{ color: "white" }}>
      <MainModel connectModel={connectModel} />
      {!web3 ? (
        <Button connectWallet buttonCenter onClick={handleModelOpen}>
          Connect Wallet
        </Button>
      ) : (
        <>
          {collectionLoading || storiesLoading || nftByTokenId.loading ? (
            <Loader content="Loading Stories" />
          ) : (
            ""
          )}
          {stories?.map((story, i) => {
            return (
              <div key={i}>
                category: {story.category}
                <br />
                Story: {story.story}
                <br />
                date: {CommonUtility.mm_dd_yy(story.updatedAt)}
                <br />
                <br />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default UserCategroiesStory;
