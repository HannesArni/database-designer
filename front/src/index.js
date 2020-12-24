import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/** @jsxImportSource @welldone-software/why-did-you-render */

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}

// https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
Object.map = function (obj, fn) {
  const ret = {};

  for (let k of Object.keys(obj)) {
    ret[k] = fn([k, obj[k]]);
  }
  return ret;
};

Object.filter = function (obj, fn) {
  const ret = {};
  for (let k of Object.keys(obj)) {
    if (fn([k, obj[k]])) ret[k] = obj[k];
  }
  return ret;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
