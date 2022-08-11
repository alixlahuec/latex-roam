/* istanbul ignore file */
import { render } from "react-dom";

import App from "./components/App";

import { initialize, setup, unmountExtensionIfExists } from "./setup";

import { EXTENSION_SLOT_ID, EXTENSION_VERSION } from "./constants";

import "./index.css";
import { ExportManager } from "./extension";


function onload({ extensionAPI }){
	const { settings } = initialize({ extensionAPI });

	window.latexRoam = new ExportManager();

	setup({ settings });

	render(
		<App extension={{ 
			version: EXTENSION_VERSION 
		}}/>, 
		document.getElementById(EXTENSION_SLOT_ID)
	);

}

function offload(){
	unmountExtensionIfExists();
	window.latexRoam.resetExport();
	delete window.latexRoam;
}

export default {
	onload: onload,
	onunload: offload
};