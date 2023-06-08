import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ModalContextProvider from './contexts/ModalContextProvider';
import Providers from './Providers'
import "toastify-js/src/toastify.css"
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Providers>
    <ModalContextProvider>
      <App />
    </ModalContextProvider>
  </Providers>
);
