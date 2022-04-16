/* eslint-disable no-useless-escape */

import { cleanUpHref } from "../utils";
import blockEmbed from "./blockEmbed";
import codeBlock from "./codeBlock";
import doublePar from "./doublePar";
import figure from "./figure";
import makeTable from "./makeTable";
import mathMode from "./mathMode";
import pageEmbed from "./pageEmbed";

const regex = {
	aliasAll: /(?:^|[^!])\[(.+?)\]\((.+?)\)/g,
	aliasBlock: /(?:^| )\[(.+?)\]\(\(\((.+?)\)\)\)/g,
	aliasPage: /\[([^\]]+?)\]\(\[\[(.+?)\]\]\)/g,
	embedBlock: /\{{2}(\[\[)?embed(\]\])?: ?\(\((.+?)\)\)\}{2}/g,
	embedPage: /\{{2}(\[\[)?embed(\]\])?: ?\[\[(.+?)\]\]\}{2}/g,
	doublePar: /\(\(([^\(\)]+?)\)\)/g,
	doubleBraces: /\{\{(.+?)\}\}/g,
	refCitekey: /\[\[@(.+?)\]\]/g,
	citekeyList: /\((.*?)(\[\[@.+?\]\])((?: ?[,;] ?\[\[@.+?\]\]){1,})(.*?)\)/g,
	citekeyPar: /\(([^\)]*?)\[\[@([^\)]+?)\]\]([^\)]*?)\)/g,
	citekey: /(^|[^\#])\[\[@([^\]]+?)\]\]/g,
	image: /!\[(.*?)\]\((.+?)\)(.*)/g,
	codeBlock: /```([\s\S]+?)```/g,
	codeInline: /(?:^|[^`])`([^`]+?)`/g,
	tag: /(?:^| )\#(.+?)( |$)/g,
	math: /\$\$([\s\S^\$]+?)\$\$([\s\S]+)?/g,
	bold: /\*{2}([^\*]+?)\*{2}/g,
	italics: /_{2}([^_]+?)_{2}/g,
	highlight: /\^{2}([^\^]+?)\^{2}/g,
	table: /{{\[{0,2}table\]{0,2}}}(.*)/g
};

function citekeyList(first, list){
	let fullList = first + list;
	let citekeys = Array.from(fullList.matchAll(/(?:\[\[@)(.+?)(?:\]\])/g)).map(match => match[1]);
	return `\\cite{${citekeys.join(", ")}}`;
}

function formatText(string, handlers){
	let output = string;

	// RENDERING BLOCK + PAGE REFS/EMBEDS, DOUBLE PARENTHESES ---------
	// Aka, is there additional text content that needs to be pulled ?
	// Block aliases
	output = output.replaceAll(regex.aliasBlock, (_match, p1, p2) => `${p1} \\footnote{${doublePar(p2, "raw", handlers)}}`);
	// Embeds : blocks
	output = output.replaceAll(regex.embedBlock, (_match, _p1, _p2, p3) => blockEmbed(p3, "latex", handlers));
	// Embeds : pages
	output = output.replaceAll(regex.embedPage, (_match, _p1, _p2, p3) => pageEmbed(p3, "latex", handlers));
	// `(())` markup
	output = output.replaceAll(regex.doublePar, (_match, p1) => doublePar(p1, "latex", handlers));

	// DELETING ELEMENTS : iframe, word-count, block part
	output = output.replaceAll(regex.doubleBraces, (match, capture) => (capture.includes("iframe") || capture.includes("word-count") || capture.includes("=:")) ? "" : `${match}`);

	// REPLACING ELEMENTS
	// Citekeys
	// Lists within parentheses
	output = output.replaceAll(regex.citekeyList, (_match, pre, first, list, post) => `(${pre}${citekeyList(first,list)}${post})`);
	// Citations within parentheses
	output = output.replaceAll(regex.citekeyPar, (_match, pre, citekey, post) => `(${pre}\\cite{${citekey}}${post})`);
	// Inline citations
	output = output.replaceAll(regex.citekey, (_match, pre, citekey) => `${pre}\\textcite{${citekey}}`);
	// Page aliases
	output = output.replaceAll(regex.aliasPage, "$1");
	// Page references
	// Note: this will remove all instances of `[[` and `]]`, even if they're not page references.
	let pageRefRegex = /(\[\[|\]\])/g;
	output = output.replaceAll(pageRefRegex, "");
	// Alias links markup
	output = output.replaceAll(regex.aliasAll, " \\href{$2}{$1}");
	// Image links markup
	output = output.replaceAll(regex.image, (_match, p1, p2, p3) => figure(p1, p2, p3, handlers));
	// Code blocks
	output = output.replaceAll(regex.codeBlock, (_match, capture) => codeBlock(capture));
	// Tags : will be removed
	output = output.replaceAll(regex.tag, "");

	// In-text references (figures, equations, tables)
	let refRegex = /\{\{(fig|eq|table)\:(.+?)\}\}/g;
	output = output.replaceAll(refRegex, (_match, type, label) => `\\ref{${type}:${label}}`);

	// ESCAPING SPECIAL CHARACTERS --------------

	let spec_chars = ["&", "%"];
	spec_chars.forEach(char => {
		let charRegex = new RegExp(`${char}`, "g");
		output = output.replaceAll(charRegex, "\\$&");
	});

	// Clean up wrong escapes
	// Math mode :
	output = output.replaceAll(regex.math, (_match, capture, label, offset) => mathMode(capture, label, offset, handlers));
	// URLs :
	let urlRegex = /\\href\{(.+?)\}\{(.+?)\}/g;
	output = output.replaceAll(urlRegex, (_match, p1, p2) => cleanUpHref(p1, p2));
	// Inline code
	output = output.replaceAll(regex.codeInline, (_match, capture) => `\\verb|${capture}|`);

	// FORMATTING ACTUAL TEXT -------------------
	// Blockquote
	if(output.charAt(0) == ">"){
		output = `\\begin{quote}${output.slice(1)}\\end{quote}`;
	}
	// Bold markup
	output = output.replaceAll(regex.bold, "\\textbf{$1}");
	// Italic markup
	output = output.replaceAll(regex.italics, "\\textit{$1}");
	// Highlight markup
	output = output.replaceAll(regex.highlight, "\\hl{$1}");

	// TODO: clean up calc/etc. ? attributes ?
	// TODO: strikethrough. Seems like this requires an external package, leaving it aside for now

	return output;
}

function grabRawText(block, handlers){
	let output = block.string || "";
	if(block.children){
		output = `${output} ${block.children.map(child => grabRawText(child, handlers)).join(" ")}`;
	}
	// Parse the text for any block references, or block/page embeds
	// Block references (check all uses of parentheticals)
	output = output.replaceAll(regex.doublePar, (_match, p1) => doublePar(p1, "raw", handlers));
	// Block embeds
	output = output.replaceAll(regex.embedBlock, (_match, _p1, _p2, p3) => blockEmbed(p3, "raw", handlers));
	// Page embeds
	output = output.replaceAll(regex.embedPage, (_match, _p1, _p2, p3) => pageEmbed(p3, "raw", handlers));
    
	return output;
}

function isTableBlock(string){
	let match = Array.from(string.matchAll(regex.table));
	if(match.length > 0){
		return match[0];
	} else {
		return false;
	}
}

function raw(block, start_indent = 0, handlers){
	let output = "";
	// If the block is a table, stop processing recursively & generate the table element
	let is_table_block = isTableBlock(block.string);
	if(is_table_block){
		let extra = is_table_block[1];
		output = `\n${makeTable(block, start_indent, extra, handlers)}\n`;
	} else {
		output = formatText(block.string, handlers);
		if(block.children){
			output = `${output}\\\\${block.children.map(child => raw(child, start_indent, handlers)).join("\\\\")}`;
		}
	}
	return output;
}

export {
	regex,
	formatText,
	grabRawText,
	isTableBlock,
	raw
};
