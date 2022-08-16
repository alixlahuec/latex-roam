import { unmountComponentAtNode } from "react-dom";

import { EXTENSION_SLOT_ID } from "./constants";


export function setupInitialSettings(settingsObject){
	const {
		other = {}
	} = settingsObject;

	return {
		other: {
			darkTheme: false,
			...other
		}
	};
}

/* istanbul ignore next */
export function initialize({ extensionAPI }){
	const current = extensionAPI.settings.getAll();
	const settings = setupInitialSettings(current || {});

	Object.entries(settings).forEach(([key, val]) => {
		extensionAPI.settings.set(key, val);
	});

	return {
		settings
	};
}

/* istanbul ignore next */
/** Sets up the extension's theme (light vs dark)
 * @param {Boolean} use_dark - If the extension's theme should be `dark`
 */
function setupDarkTheme(use_dark = false){
	document.getElementsByTagName("body")[0].setAttribute("rl-dark-theme", (use_dark == true).toString());
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
	setupDarkTheme(settings.other.darkTheme);
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