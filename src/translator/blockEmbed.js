import { queryBlockContents } from "../roam";
import { grabRawText, raw } from "./common";

// RAW only
function blockEmbed(uid, mode = "raw", handlers){
	let blockContents = queryBlockContents(uid);
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
