import REGEX from "./regex";
import { formatText } from "./common";

import { asyncReplaceAll } from "../utils";


async function parsePopover(_match, text, content){
	return `${text.trim()} \\footnote{${await formatText(content.trim())}}`;
}

async function replacePopover(capture){
	return await asyncReplaceAll(capture, REGEX.popover, parsePopover);
}

async function parseDoubleBraces(match, pre, capture, _post){
	return (capture.includes("iframe") || capture.includes("word-count")) 
		? ""
		: capture.includes("=:")
			? (pre + await replacePopover(capture))
			: match;
}

export default parseDoubleBraces;