import React from "react";
import { render } from "react-dom";

import App from "./components/App";

import { initialize, setup, setupPortals, unmountExtensionIfExists } from "./setup";

import { EXTENSION_SLOT_ID, EXTENSION_VERSION } from "./constants";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./index.css";
import { ExportManager } from "./extension";


function onload({ extensionAPI }){
	const { settings } = initialize({ extensionAPI });

	window.latexRoam = new ExportManager();

	setupPortals();

	setup();

	render(
		<UserSettingsProvider extensionAPI={extensionAPI} init={{ ...settings, requests }}>
			<App extension={{ 
				version: EXTENSION_VERSION 
			}}/>
		</UserSettingsProvider>, 
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