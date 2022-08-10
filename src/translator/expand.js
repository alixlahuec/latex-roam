import REGEX from "./regex";

import blockEmbed from "./blockEmbed";
import doublePar from "./doublePar";
import pageEmbed from "./pageEmbed";


async function expandInserts(string){
	let output = string;

	// Block aliases
	output = output.replaceAll(REGEX.aliasBlock, (_match, p1, p2) => `${p1} \\footnote{${doublePar(p2, "raw")}}`);
	// Embeds : blocks
	output = output.replaceAll(REGEX.embedBlock, (_match, _p1, _p2, p3) => blockEmbed(p3, "latex"));
	// Embeds : pages
	output = output.replaceAll(REGEX.embedPage, (_match, _p1, _p2, p3) => pageEmbed(p3, "latex"));
	// `(())` markup
	output = output.replaceAll(REGEX.doublePar, (_match, p1) => doublePar(p1, "latex"));

	return output;
}

export default expandInserts;