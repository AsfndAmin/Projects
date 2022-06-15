import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

import store from "store/store";
import { Provider } from "react-redux";
import "antd/dist/antd.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ThemeProvider } from "styled-components";
import theme from "theme";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
   
 <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider> 
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
