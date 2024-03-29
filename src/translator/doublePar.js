import { getBlockText } from "Roam";
import { grabRawText } from "./common";


async function doublePar(content, mode){
	// Check if content is a valid block reference
	const isBlockRef = getBlockText(content);
	// If it's a block ref, render its contents
	if(isBlockRef.length > 0){
		switch(mode){
		case "latex":
			return isBlockRef[0][0];
		case "raw":
		default: 
			return await grabRawText({ string: isBlockRef[0][0] });
		}
	} else{
		switch(mode){
		case "latex":
			// In Roam, it's invalid to insert any aliases in a `(())` so no need to handle that case here
			// If the `(())` just contains text, render it as footnote
			return `\\footnote{${content}}`;
		case "raw":
		default:
			return content;
		}
	}
}

async function parseBlockAlias(_match, p1, p2){
	return `${p1} \\footnote{${await doublePar(p2, "raw")}}`;
}

async function parseDoublePars(_match, p1){
	return await doublePar(p1, "latex");
}

export {
	doublePar,
	parseBlockAlias,
	parseDoublePars
};
