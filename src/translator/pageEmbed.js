import { grabRawText, raw } from "./common";
import { queryPageContentsByTitle } from "Roam";


async function pageEmbed(title, mode){
	const pageContents = queryPageContentsByTitle(title);
	switch(mode){
	case "latex":{
		// TODO: handle actual processing of actual page structure
		// For now, just rendering everything as one raw block to test basic parsing
		const elems = pageContents.children || [];
		let elemContents = "";
		if(elems.length > 0){
			elemContents = await Promise.all(elems.map(async(child) => await raw(child, 0)));
			elemContents = `\\${elemContents.join("\n")}`;
		}
		return `${pageContents.title}${elemContents}`;
	}
	case "raw":
	default:
		return await grabRawText(pageContents);
	}
}

async function parsePageEmbed(_match, _p1, _p2, p3){
	return await pageEmbed(p3, "latex");
}

export {
	pageEmbed,
	parsePageEmbed
};
