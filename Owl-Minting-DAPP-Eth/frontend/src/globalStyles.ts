import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  } 
 body
{
  overflow-x: hidden !important;
  font-family: 'Poppins', sans-serif;
  background: #010101;
}

iframe
{
  position: absolute !important;
  width: none !important;
  top: none !important;
  left: none !important;
  right: none !important;
  z-index: -5 !important;
}

 /* Loader */
 .cover-spin {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(141, 141, 141, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}


 
/* Models styles  */
.ant-modal-footer
  {
    display: none;
  }
  .ant-modal-close
  {
    display: none;
  }
  .ant-modal-content
  {
   background: none;
  }
  .ant-modal-body
  {
    padding: 0px;
  }
  .ant-modal-mask
  {
    background-color: rgb(0 0 0 / 78%) ;
  }
  .closeModelInput
  {
    transform: translateY(-2px);
  }
    .ant-space-align-baseline
  {
    display: flex;
    justify-content:center  ;
  }
  .modalInputMale
  {
    border-top-right-radius:7px;
  border-bottom-right-radius:7px;
  transform: translateX(-6px);
  }
  .ant-form-vertical .ant-form-item-label>label {
  
 
    font-weight:600;
}

  /* Models styles */


   
 
`;

export default GlobalStyle;
