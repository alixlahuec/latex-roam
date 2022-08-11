/* eslint-disable no-useless-escape */

import { asyncReplaceAll, cleanUpHref } from "../utils";


import { isTableBlock, makeTable } from "./table";
import { parseAlias, parseAliasPage, replaceTextFormatting } from "./markup";
import { parseCodeBlock, parseCodeInline } from "./code";
import expandInserts from "./expand";
import mathMode from "./mathMode";
import parseDoubleBraces from "./doubleBraces";
import { parseImage } from "./figure";
import parseSpecialReferences from "./specialReferences";
import { replaceCitekeys } from "./citekeys";

import REGEX from "./regex";


async function formatText(string){
	let output = string;

	// RENDERING BLOCK + PAGE REFS/EMBEDS, DOUBLE PARENTHESES ---------
	// Aka, is there additional text content that needs to be pulled ?
	output = await expandInserts(output);

	// DELETING ELEMENTS : iframe, word-count, block part
	output = output.replaceAll(REGEX.doubleBraces, parseDoubleBraces);

	// REPLACING ELEMENTS
	// Citekeys
	output = replaceCitekeys(output);
	// Page aliases
	output = output.replaceAll(REGEX.aliasPage, parseAliasPage);
	// Double brackets
	output = output.replaceAll(REGEX.doubleBrackets, "");
	// Alias links markup
	output = output.replaceAll(REGEX.aliasAll, parseAlias);
	// Image links markup
	output = await asyncReplaceAll(output, REGEX.image, parseImage);

	// Code blocks
	output = output.replaceAll(REGEX.codeBlock, parseCodeBlock);
	// Tags : will be removed
	output = output.replaceAll(REGEX.tag, "");

	// In-text references (figures, equations, tables)
	output = output.replaceAll(REGEX.specialRef, parseSpecialReferences);

	// ESCAPING SPECIAL CHARACTERS --------------

	const spec_chars = ["&", "%"];
	spec_chars.forEach(char => {
		const charRegex = new RegExp(`${char}`, "g");
		output = output.replaceAll(charRegex, "\\$&");
	});

	// Clean up wrong escapes
	// Math mode :
	output = await asyncReplaceAll(output, REGEX.math, async(_match, capture, label, offset) => await mathMode(capture, label, offset));
	// URLs :
	const urlRegex = /\\href\{(.+?)\}\{(.+?)\}/g;
	output = output.replaceAll(urlRegex, (_match, p1, p2) => cleanUpHref({ url: p1, text: p2 }));
	// Inline code
	output = output.replaceAll(REGEX.codeInline, parseCodeInline);

	// FORMATTING ACTUAL TEXT -------------------
	// Blockquote
	if(output.charAt(0) == ">"){
		output = `\\begin{quote}${output.slice(1)}\\end{quote}`;
	}
	output = replaceTextFormatting(output);

	// TODO: clean up calc/etc. ? attributes ?
	// TODO: strikethrough. Seems like this requires an external package, leaving it aside for now

	return output;
}

async function grabRawText(block){
	let output = block.string || "";
	if(block.children){
		output = `${output} ${(await Promise.all(block.children.map(async(child) => await grabRawText(child)))).join(" ")}`;
	}
	output = await expandInserts(output);
    
	return output;
}

async function raw(block, start_indent = 0){
	let output = "";
	// If the block is a table, stop processing recursively & generate the table element
	const is_table_block = isTableBlock(block.string);
	if(is_table_block){
		const extra = is_table_block[1];
		const table = await makeTable(block, start_indent, extra);
		output = `\n${table}\n`;
	} else {
		output = await formatText(block.string);
		if(block.children){
			const elems = await Promise.all(block.children.map(async(child) => await raw(child, start_indent)));
			output = `${output}\\\\${elems.join("\\\\")}`;
		}
	}
	return output;
}

export {
	formatText,
	grabRawText,
	raw
};
