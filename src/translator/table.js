import REGEX from "./regex";

import { formatText } from "./common";
import { sortRoamBlocks } from "../utils";


function isTableBlock(string){
	const match = Array.from(string.matchAll(REGEX.table));
	if(match.length > 0){
		return match[0];
	} else {
		return false;
	}
}

function traverseTable(block, handlers){
	const rows = [];
	sortRoamBlocks(block.children).forEach(child => {
		rows.push(...traverseRow(child, handlers));
	});
	return rows;
}

function traverseRow(block, handlers){
	if(!block.children){
		return [[storeCell(block, handlers)]];
	} else {
		return sortRoamBlocks(block.children).map(child => traverseRow(child, handlers).map(path => [storeCell(block, handlers), ...path])).flat(1);
	}
}

function storeCell(block, handlers){
	return {
		text: formatText(block.string, handlers),
		align: block["text-align"] ? block["text-align"].charAt(0) : "l"
	};
}

function makeTable(block, start_indent = 0, extra = "", handlers){
	const table_indent = "\t".repeat(start_indent);

	const afterTextMatch = Array.from(block.string.matchAll(/\{\{(?:\[\[)?table(?:\]\])?\}\}(.+)/g))[0] || false;
	// Below is the same structure as with figures rendering
	const labelRegex = /(`.+?`)/g;
	const labelMatch = Array.from(extra.matchAll(labelRegex))[0] || false;
	const labelEl = labelMatch ? `${table_indent}\\label{table:${labelMatch[0].slice(1,-1)}}\n` : "";

	const desc = extra.replace(labelRegex, "").trim();
	const descEl = (desc.length > 0) ? `${table_indent}\\caption{${formatText(afterTextMatch[1], handlers)}}\n` : "";

	const rows = traverseTable(block, handlers);
	// Count the actual number of columns
	const n_cols = rows.reduce((f, s) => f.length >= s.length ? f.length : s.length);
	// Extract alignment sequence from header row
	let align_seq = rows[0].map(col => col.align);
	if(align_seq.length < n_cols){
		const fills = Array.from({ length: n_cols - align_seq.length }, () => "l");
		align_seq.push(...fills);
	}
	align_seq = align_seq.join(" ");
	// Get contents of rows
	const row_indent = "\t".repeat(start_indent+1);
	const textRows = rows.map(row => `${row_indent}` + row.map(cell => cell.text).join(" & ") + " \\\\").join("\n");

	return `${table_indent}\\begin{table}[h!]\n${table_indent}\\centering\n${table_indent}\\begin{tabular}{${align_seq}}\n${row_indent}\\hline\n${textRows}\n${row_indent}\\hline\n${table_indent}\\end{tabular}\n${descEl}${labelEl}${table_indent}\\end{table}`;
}

export {
	isTableBlock,
	makeTable
};