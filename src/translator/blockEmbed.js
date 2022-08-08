import { grabRawText, raw } from "./common";
import { queryBlockContents } from "Roam";

// RAW only
function blockEmbed(uid, mode = "raw", handlers){
	const blockContents = queryBlockContents(uid);
	switch(mode){
	case "latex":
		// TODO: handle processing of actual block structure
		// For now, just rendering everything as one raw block to test basic parsing
		return raw(blockContents, 0, handlers);
	case "raw":
	default:
		return grabRawText(blockContents, handlers);
	}
}

export default blockEmbed;
