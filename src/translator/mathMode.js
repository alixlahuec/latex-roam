/* eslint-disable no-useless-escape */
import { formatText } from "./common";

function mathMode(capture, label, offset, handlers){
	let mathContent = capture;
	if(offset == 0){
		let eqLabel = label;
		if(typeof(eqLabel) == "undefined"){
			eqLabel = "";
		} else{
			let hasLabel = Array.from(eqLabel.matchAll(/(`.+?`)/g))[0] || false;
			eqLabel = hasLabel[0] ? `\\label{eq:${hasLabel[0].slice(1,-1)}}\n` : "";
		}
		return `\n\\begin{equation}\n${eqLabel}${capture}\n\\end{equation}`;
	} else{
		return `$${mathContent.replaceAll(/\\\&/g, "&")}$${formatText(label, handlers)}`;
	}
}

export default mathMode;