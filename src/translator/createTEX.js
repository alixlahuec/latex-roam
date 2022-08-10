/* eslint-disable no-useless-escape */
import { formatText, grabRawText, raw, regex } from "./common";
import { isTableBlock, makeTable } from "./table";

import { makeBibliography, sortRoamBlocks, todayDMY } from "../utils";
import { queryBlockContents } from "../roam";



async function convertBlocks(arr, { document_class = "book", numbered = true, start_header = 1 }){
	const blocks = sortRoamBlocks(arr);

	let processedOutput = await blocks.reduce(async(output, block) => {
		const prev = await output;
		let out;

		if(block.heading){
			const header = await makeHeader(block.string, { document_class: document_class, numbered: numbered, level: start_header });
			out = `${prev}\n${header}`;
			if(block.children){
				if(block["view-type"] == "document" || typeof(block["view-type"]) == "undefined"){
					const elems = await convertBlocks(block.children, { document_class: document_class, numbered: numbered, start_header: start_header+1 });
					out = `${out}${elems}`;
				} else{
					const list = await makeList(block.children, block["view-type"], 0);
					out = `${out}${list}`;
				}
			}
			return out;
		} else {
			// If the block isn't a heading, stop using the header tree for recursion
			const content = await parseBlock(block);
			out = `${prev}\n${content}\\\\`;
		}
		return out;
	}, "");

	if(processedOutput.slice(-2) == "\\\\"){
		processedOutput = processedOutput.slice(0, -2);
	}
	return processedOutput;
}

async function _createTEX(exportUID, document_class = "book", { numbered = true, cover = true, start_header = 1, authors = "", title = "" } = {}){
	const contents = queryBlockContents(exportUID);

	// Scan for citations
	const citekeys = await getCitekeysList(contents);
	let bibliography = "";
	if(citekeys.length > 0){
		try{
			bibliography = await makeBibliography(citekeys);
			addBibliography(bibliography);
		} catch(e){
			console.error(e);
		}
	}

	const bibPreamble = bibliography.length > 0 ? "\\usepackage[backend=biber,style=apa,sorting=nyt]{biblatex}\n\\addbibresource{bibliography.bib}\n" : "";
	const bibPrint = bibliography.length > 0 ? "\\medskip\n\n\\printbibliography\n" : "";

	const header = `\n\\documentclass{${document_class}}\n\\title{${title}}\n\\author{${authors}}\n\\date{${todayDMY()}}\n\n\\usepackage{amsmath}\n\\usepackage{graphicx}\n\\usepackage{soul}\n${bibPreamble}\\usepackage{hyperref}\n\\hypersetup{colorlinks=true,citecolor=black}\n\n\\begin{document}\n${cover ? "\\maketitle" : ""}`;

	let body = "";
	try{
		body += await convertBlocks(contents.children, { document_class: document_class, numbered: numbered, start_header: start_header });
	} catch(e){
		console.error(e);
	}

	const footer = `\n${bibPrint}\\end{document}`;

	return `${header}\n${body}\n${footer}`;
}

// `entity` is the dictionary returned for the current page/current block (i.e, by queryBlockContents or queryPageContentsByTitle)
// This function returns an Array containing all the (unique) citekey references contained in the entity's contents
// Citekey tags aren't taken into account
async function getCitekeysList(entity){
	return [...new Set(Array.from((await grabRawText(entity)).matchAll(REGEX.refCitekey)).map(regexmatch => regexmatch[1]))];
}


async function makeHeader(string, { document_class = "book", numbered = true, level = 1 } = {}){
	const text = await formatText(string);

	let cmd = "";
	const header_level = (document_class == "article") ? (level + 1) : level;
	switch(header_level){
	case 1:
		cmd = "chapter";
		break;
	case 2:
		cmd = "section";
		break;
	case 3:
		cmd = "subsection";
		break;
	case 4:
		cmd = "subsubsection";
		break;
	default:
		return `${text}\\\\`;
	}

	return `\\${cmd}${(!numbered) ? "*" : ""}{${text}}\n`;
}

async function makeList(elements, type, start_indent = 0){
	const nesting_level = start_indent/2 + 1;
	const list_indent = "\t".repeat(start_indent);
	if(nesting_level <= 4){
		const cmd = (type == "bulleted") ? "itemize" : "enumerate";
		const blocks = await Promise.all(elements.map(async(el) => {
			const elemContents = await parseListElement(el, start_indent+1);
			return `${"\t".repeat(start_indent+1)}${elemContents}`;
		}));
		return `${list_indent}\\begin{${cmd}}\n${blocks.join("\n")}\n${list_indent}\\end{${cmd}}`;
	} else {
		const blocks = await Promise.all(elements.map(async(el) => await raw(el, start_indent)));
		return `${list_indent}${blocks.join("\\\\")}`;
	}
}

async function parseBlock(block){
	let output = "";
	// If the block is a table, stop processing recursively & generate the table element
	const is_table_block = isTableBlock(block.string);
	if(is_table_block){
		const extra = is_table_block[1];
		output = await makeTable(block, 0, extra);
	} else {
		// Do stuff to process the children of a non-heading, non-table block
		const text = await formatText(block.string);
		output = `${text}`;
		if(block.children){
			const children = sortRoamBlocks(block.children);
			const format = (block["view-type"]) ? block["view-type"] : "bulleted";
			switch(format){
			case "document":{
				const elems = await Promise.all(children.map(async(child) => await parseBlock(child)));
				output = `${output}\\\\\n${elems.join("\\\\")}`;
				break;
			case "bulleted":
			case "numbered":
			default:{
				const list = await makeList(children, format, 0);
				output = `${output}\n${list}`;
				break;
			}
			}
		}
	}
	return output;
}

async function parseListElement(block, start_indent){
	let output = "";
	const is_table_block = isTableBlock(block.string);
	if(is_table_block){
		const extra = is_table_block[1];
		const table = await makeTable(block, start_indent+1, extra);
		output = `\\item{\n${table}}`;
	} else {
		const format = (block["view-type"]) ? block["view-type"] : "bulleted";
		switch(format){
		// If the list item is in "Document" mode, pull all of its content as raw & use that as the list item, with newline separation
		case "document": {
			const content = await raw(block, start_indent+1);
			output = `\\item{${content}}`;
			break;
		}
		// Otherwise, use the string as the list item & render a sublist
		case "bulleted":
		case "numbered":
		default:{
			const text = await formatText(block.string);
			console.log("Default list element:", text);
			if(block.children){
				const list = await makeList(block.children, format, start_indent + 1);
				output = `\\item{${text}}\n${list}`;
			} else{
				output = `\\item{${text}}`;
			}
			break;
		}
		}
	}
	return output;
}

export default _createTEX;
