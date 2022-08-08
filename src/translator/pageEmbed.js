import { grabRawText, raw } from "./common";
import { queryPageContentsByTitle } from "../roam";


function pageEmbed(title, mode = "raw", handlers){
	const pageContents = queryPageContentsByTitle(title);
	switch(mode){
	case "latex":
		// TODO: handle actual processing of actual page structure
		// For now, just rendering everything as one raw block to test basic parsing
		return `${pageContents.title}\\${(pageContents.children) ? pageContents.children.map(child => raw(child, 0, handlers)).join("\n") : ""}`;
	case "raw":
	default:
		return grabRawText(pageContents, handlers);
	}
}

export default pageEmbed;
