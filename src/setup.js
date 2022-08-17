import { unmountComponentAtNode } from "react-dom";

import { EXTENSION_SLOT_ID } from "./constants";
import { setDarkTheme } from "./utils";


export function setupInitialSettings(settingsObject){
	const {
		darkTheme = false
	} = settingsObject;

	return {
		darkTheme
	};
}

/* istanbul ignore next */
function setupRoamPanel({ extensionAPI }){
	const panelConfig = {
		tabTitle: "LaTeX Exporter",
		settings: [
			{ id: "darkTheme",
				name: "Dark Theme",
				description: "Toggle dark theme for the extension's interface",
				action: {
					type: "switch",
					onChange: (e) => {
						setDarkTheme(e.target.checked);
					} 
				} 
			}
		]
	};

	extensionAPI.settings.panel.create(panelConfig);
}

/* istanbul ignore next */
export function initialize({ extensionAPI }){
	const current = extensionAPI.settings.getAll();
	const settings = setupInitialSettings(current || {});

	Object.entries(settings).forEach(([key, val]) => {
		extensionAPI.settings.set(key, val);
	});

	setupRoamPanel({ extensionAPI });

	return {
		settings
	};
}

/* istanbul ignore next */
/** Injects DOM elements to be used as React portals by the extension */
function setupPortals(){

	unmountExtensionIfExists();

	const extensionSlot = document.createElement("div");
	extensionSlot.id = EXTENSION_SLOT_ID;
	document.getElementById("app").appendChild(extensionSlot);

}

/* istanbul ignore next */
/** Sets up the extension */
export function setup({ settings }){
	setupPortals();
	setDarkTheme(settings.darkTheme);
}

/* istanbul ignore next */
export function unmountExtensionIfExists(){
	const existingSlot = document.getElementById(EXTENSION_SLOT_ID);
	if(existingSlot){
		try{
			unmountComponentAtNode(existingSlot);
			existingSlot.remove();
		} catch(e){
			console.error(e);
		}
	}
}