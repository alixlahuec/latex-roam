/** @constant {String} The extension's current version (from package.json) */
export const EXTENSION_VERSION = require("../package.json").version;

/** @constant {String} The HTML id for the extension's icon's container */
export const EXTENSION_SLOT_ID = "latex-roam-slot";

export const CustomClasses = {
	BUTTON_CLASS: "latex-roam--button",
	DIALOG_CLASS: "latex-roam--dialog",
	MENU_CLASS: "latex-roam--menu",
	POPOVER_CLASS: "latex-roam-popover"
};