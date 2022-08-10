import { grabRawText, raw } from "./common";
import { queryPageContentsByTitle } from "../roam";


async function pageEmbed(title, mode = "raw"){
	const pageContents = queryPageContentsByTitle(title);
	switch(mode){
	case "latex":
		// TODO: handle actual processing of actual page structure
		// For now, just rendering everything as one raw block to test basic parsing
		return `${pageContents.title}\\${(pageContents.children) ? (await Promise.all(pageContents.children.map(async(child) => await raw(child, 0)))).join("\n") : ""}`;
	case "raw":
	default:
		return await grabRawText(pageContents);
	}
}

export default pageEmbed;
