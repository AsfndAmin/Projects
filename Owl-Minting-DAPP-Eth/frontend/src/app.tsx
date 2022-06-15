import { GetFeeHook } from 'hooks/feeHook'
import React, { useEffect,useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GlobalStyle from './globalStyles'
import { useAppDispatch, useAppSelector } from 'store/store'
import { Home, Admin,AdminLogin, UserCategoriesStories } from 'pages'
import { changeNetwork } from 'switch'
import { updateAccount } from 'store/redux/slices/wallet3Connect/web3ConnectSlice'
import CategoryStoryListing from 'pages/categoryStoryListing'
import UserNft from "pages/userNft";
import { ToastMessage } from "components/common";
const App = () => {
  // const dispatch = useAppDispatch()
  // const state = useAppSelector((state) => state)
  // const { web3, chainId } = state.web3Connect
   GetFeeHook()
  // ;(window as any).ethereum.on('accountsChanged', function (accounts) {
  //   dispatch(updateAccount({ account: accounts[0] }))
  // })

  const state = useAppSelector((state) => state);
  const { web3, chainId, web3ConnectingError } = state.web3Connect;
  

  const [toast, setToast] = useState(false);

  useEffect(() => {
    // https://metamask.io/

    if (web3ConnectingError=="Metamask Error Please Download Metamask We are redirecting you to metamask website") {
      setToast(true);
      ToastMessage("", web3ConnectingError, "error");

      setTimeout(() => {
        setToast(false);
        openMetamask();
      }, 3000);
 
    }
  }, [web3, web3ConnectingError]);

  const openMetamask = () => {
    window.open("https://metamask.io","_blank");
  };


 

  // useEffect(() => {
  //   if (web3 !== null) changeNetwork(chainId)
  // }, [web3])

  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/white-list" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-nft" element={<UserNft />} />
        <Route path="/stories" element={<CategoryStoryListing/>} />
        <Route path="/user-stories" element={<UserCategoriesStories/>} />
      </Routes>
    </Router>
  );
};

export default App;
