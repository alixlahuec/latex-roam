import { grabRawText, raw } from "./common";
import { queryBlockContents } from "Roam";

// RAW only
async function blockEmbed(uid, mode = "raw"){
	const blockContents = queryBlockContents(uid);
	switch(mode){
	case "latex":
		// TODO: handle processing of actual block structure
		// For now, just rendering everything as one raw block to test basic parsing
		return await raw(blockContents, 0);
	case "raw":
	default:
		return await grabRawText(blockContents);
	}
}

export default blockEmbed;
