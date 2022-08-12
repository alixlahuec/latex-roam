/* eslint-disable no-useless-escape */
import { formatText } from "./common";

async function mathMode(capture, extra = "", offset){
	const mathContent = capture;
	console.log(capture, extra, offset);
	
	if(offset == 0){
		const labelRegex = /(`.+?`)/g;
		const labelMatch = Array.from(extra.matchAll(labelRegex))[0] || false;
		const labelEl = labelMatch ? `\\label{eq:${labelMatch[0].slice(1,-1)}}` : "";

		return `\n\\begin{equation}\n${labelEl}${mathContent}\n\\end{equation}`;
	} else {
		const eqLabel = extra ? await formatText(extra) : "";
		return `$${mathContent.replaceAll(/\\\&/g, "&")}$${eqLabel}`;
	}
}

async function parseMathMode(_match, capture, extra, offset){
	return await mathMode(capture, extra, offset);
}

export {
	parseMathMode
};