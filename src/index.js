import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

import "./index.css";

window.roamToLatex = {};

(()=>{

	const extension = {
		version: "0.1.0"
	};

	window.roamToLatex = {
		extension
	};

	const root = createRoot(document.getElementsByTagName("body")[0]);
	root.render(<App extension={extension}/>);

})();