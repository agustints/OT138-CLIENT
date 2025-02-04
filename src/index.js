import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "../src/store/index";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "sweetalert/dist/sweetalert.css";
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
