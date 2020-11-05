import scss from "./scss/style.scss";

import React from "react";
import ReactDOM from "react-dom";

import Popup from "./components/popup/popup.jsx";

const price = 2000000;

const init = () => {
  ReactDOM.render(
    <Popup price = {price}/>,
    document.querySelector(`#root`));
};

init();
