/* eslint-disable no-useless-escape */

import { queryBlockContents } from "../roam";
import { makeBibliography, sortRoamBlocks, todayDMY } from "../utils";
import { formatText, grabRawText, isTableBlock, raw, regex } from "./common";
import makeTable from "./makeTable";


function convertBlocks(arr, {document_class = "book", numbered = true, start_header = 1} = {}, handlers){
	let output = "";
	let blocks = sortRoamBlocks(arr);

	blocks.forEach(block => {
		if(block.heading){
			output = `${output}\n${makeHeader(block.string, {document_class: document_class, numbered: numbered, level: start_header}, handlers)}`;
			if(block.children){
				if(block["view-type"] == "document" || typeof(block["view-type"]) == "undefined"){
					output = `${output}${convertBlocks(block.children, {document_class: document_class, numbered: numbered, start_header: start_header+1}, handlers)}`;
				} else{
					output = `${output}${makeList(block.children, block["view-type"], 0, handlers)}`;
				}
			}
		} else{
			// If the block isn't a heading, stop using the header tree for recursion
			output = `${output}\n${parseBlock(block, handlers)}\\\\`;
		}
	});
	if(output.slice(-2) == "\\\\"){
		output = output.slice(0, -2);
	}
	return output;
}

async function createTEX(exportUID, document_class = "book", {numbered = true, cover = true, start_header = 1, authors = "", title = ""} = {}, handlers){
	const { addBibliography } = handlers;
	let contents = queryBlockContents(exportUID);

	// Scan for citations
	let citekeys = getCitekeysList(contents, handlers);
	let bibliography = "";
	if(citekeys.length > 0 && window.zoteroRoam && true){
		try{
			bibliography = await makeBibliography(citekeys, {include: "biblatex"});
			addBibliography(bibliography);
		} catch(e){
			alert(`There was an error while preparing the bibliography :\n${e}`);
		}
	}

	let bibPreamble = bibliography.length > 0 ? "\\usepackage[backend=biber,style=apa,sorting=nyt]{biblatex}\n\\addbibresource{bibliography.bib}\n" : "";
	let bibPrint = bibliography.length > 0 ? "\\medskip\n\n\\printbibliography\n" : "";

	let header = `\n\\documentclass{${document_class}}\n\\title{${title}}\n\\author{${authors}}\n\\date{${todayDMY()}}\n\n\\usepackage{amsmath}\n\\usepackage{graphicx}\n\\usepackage{soul}\n${bibPreamble}\\usepackage{hyperref}\n\\hypersetup{colorlinks=true,citecolor=black}\n\n\\begin{document}\n${cover ? "\\maketitle" : ""}`;

	let body = "";
	try{
		body += convertBlocks(contents.children, {document_class: document_class, numbered: numbered, start_header: start_header}, handlers);
	} catch(e){
		console.log(e);
		alert(`There was an error while processing the contents of the export :\n${e}`);
	}

	let footer = `\n${bibPrint}\\end{document}`;

	return `${header}\n${body}\n${footer}`;
}

// `entity` is the dictionary returned for the current page/current block (i.e, by queryBlockContents or queryPageContentsByTitle)
// This function returns an Array containing all the (unique) citekey references contained in the entity's contents
// Citekey tags aren't taken into account
function getCitekeysList(entity, handlers){
	return [...new Set(Array.from(grabRawText(entity, handlers).matchAll(regex.refCitekey)).map(regexmatch => regexmatch[1]))];
}


function makeHeader(string, {document_class = "book", numbered = true, level = 1} = {}, handlers){
	let cmd = "";
	let header_level = (document_class == "article") ? (level + 1) : level;
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
		return `${formatText(string, handlers)}\\\\`;
	}

	return `\\${cmd}${(!numbered) ? "*" : ""}{${formatText(string, handlers)}}\n`;
}

function makeList(elements, type, start_indent = 0, handlers){
	let nesting_level = start_indent/2 + 1;
	let list_indent = "\t".repeat(start_indent);
	if(nesting_level <= 4){
		let cmd = (type == "bulleted") ? "itemize" : "enumerate";
		let blocks = elements.map(el => `${"\t".repeat(start_indent+1)}${parseListElement(el, start_indent+1, handlers)}`);
		return `${list_indent}\\begin{${cmd}}\n${blocks.join("\n")}\n${list_indent}\\end{${cmd}}`;
	} else{
		return `${list_indent}${elements.map(el => raw(el, start_indent, handlers)).join("\\\\")}`;
	}
}

function parseBlock(block, handlers){
	let output = "";
	// If the block is a table, stop processing recursively & generate the table element
	let is_table_block = isTableBlock(block.string);
	if(is_table_block){
		let extra = is_table_block[1];
		output = makeTable(block, 0, extra, handlers);
	} else {
		// Do stuff to process the children of a non-heading, non-table block
		output = `${formatText(block.string, handlers)}`;
		if(block.children){
			let children = sortRoamBlocks(block.children);
			let format = (block["view-type"]) ? block["view-type"] : "bulleted";
			switch(format){
			case "document":
				output = `${output}\\\\\n${children.map(child => parseBlock(child, handlers)).join("\\\\")}`;
				break;
			case "bulleted":
			case "numbered":
				output = `${output}\n${makeList(children, format, 0, handlers)}`;
				break;
			}
		}
	}
	return output;
}

function parseListElement(block, start_indent, handlers){
	let output = "";
	let is_table_block = isTableBlock(block.string);
	if(is_table_block){
		let extra = is_table_block[1];
		output = `\\item{\n${makeTable(block, start_indent+1, extra, handlers)}}`;
	} else {
		let format = (block["view-type"]) ? block["view-type"] : "bulleted";
		switch(format){
		// If the list item is in "Document" mode, pull all of its content as raw & use that as the list item, with newline separation
		case "document":
			output = `\\item{${raw(block, start_indent+1, handlers)}}`;
			break;
			// Otherwise, use the string as the list item & render a sublist
		case "bulleted":
		case "numbered":
			if(block.children){
				output = `\\item{${formatText(block.string, handlers)}}\n${makeList(block.children, format, start_indent + 1, handlers)}`;
			} else{
				output = `\\item{${formatText(block.string, handlers)}}`;
			}
			break;
		}
	}
	return output;
}

export default createTEX;
