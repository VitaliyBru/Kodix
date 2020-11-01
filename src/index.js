import React from "react";
import ReactDOM from "react-dom";

import Popup from "./components/popup/popup.jsx";

const init = () => {
  ReactDOM.render(<Popup/>, document.querySelector(`#root`));
};

init();
