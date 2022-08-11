import REGEX from "./regex";
import { asyncReplaceAll } from "../utils";

import { parseBlockAlias, parseDoublePars } from "./doublePar";
import { parseBlockEmbed } from "./blockEmbed";
import { parsePageEmbed } from "./pageEmbed";


async function expandInserts(string){
	let output = string;

	// Block aliases
	output = await asyncReplaceAll(output, REGEX.aliasBlock, parseBlockAlias);
	// Embeds : blocks
	output = await asyncReplaceAll(output, REGEX.embedBlock, parseBlockEmbed);
	// Embeds : pages
	output = await asyncReplaceAll(output, REGEX.embedPage, parsePageEmbed);
	// `(())` markup
	output = await asyncReplaceAll(output, REGEX.doublePar, parseDoublePars);

	return output;
}

export default expandInserts;