import React from "react";
import { render as ReactDOMRender } from "react-dom";
import App from "./components/App";

import "./index.css";

window.roamToLatex = {};

(()=>{

	const extension = {
		version: "0.1.0"
	};

	ReactDOMRender(<App extension={extension}/>, document);

})();