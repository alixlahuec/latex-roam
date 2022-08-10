import REGEX from "./regex";
import { asyncReplaceAll } from "../utils";

import blockEmbed from "./blockEmbed";
import doublePar from "./doublePar";
import pageEmbed from "./pageEmbed";


async function expandInserts(string){
	let output = string;

	// Block aliases
	output = await asyncReplaceAll(output, REGEX.aliasBlock, async(_match, p1, p2) => `${p1} \\footnote{${await doublePar(p2, "raw")}}`);
	// Embeds : blocks
	output = await asyncReplaceAll(output, REGEX.embedBlock, async(_match, _p1, _p2, p3) => await blockEmbed(p3, "latex"));
	// Embeds : pages
	output = await asyncReplaceAll(output, REGEX.embedPage, async(_match, _p1, _p2, p3) => await pageEmbed(p3, "latex"));
	// `(())` markup
	output = await asyncReplaceAll(output, REGEX.doublePar, async(_match, p1) => await doublePar(p1, "latex"));

	return output;
}

export default expandInserts;