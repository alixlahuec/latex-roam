import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

import "./index.css";

window.roamToLatex = {};

(()=>{

	const extension = {
		slot: "roam-to-latex",
		version: "0.1.0"
	};

	window.roamToLatex = {
		version: extension.version
	};

	try{ 
		document.getElementById(extension.version).remove(); 
	} catch(e){
		// Do nothing
	}
	let extensionSlot = document.createElement("div");
	extensionSlot.id = extension.slot;
	document.getElementById("app").appendChild(extensionSlot);

	const root = createRoot(document.getElementById(extension.slot));
	root.render(<App extension={extension}/>);

})();