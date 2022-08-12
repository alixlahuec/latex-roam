import REGEX from "./regex";

import { formatText } from "./common";
import { sortRoamBlocks } from "../utils";


function isTableBlock(string){
	const match = Array.from(string.matchAll(REGEX.table));
	if(match.length > 0){
		const [/*_match*/, extra/*, _index, _input*/] = match[0];
		return extra;
	} else {
		return false;
	}
}

async function traverseTable(block){
	return await (sortRoamBlocks(block.children).reduce(async(rows, child) => {
		const prev = await rows;
		const content = await traverseRow(child);
		return [...prev, ...content];
	}, []));
}

async function traverseRow(block){
	if(!block.children){
		return [[await storeCell(block)]];
	} else {
		return (await Promise.all(sortRoamBlocks(block.children)
			.map(async(child) => {
				const content = await traverseRow(child);
				return await Promise.all(content.map(async(path) => [await storeCell(block), ...path]));
			})))
			.flat(1);
	}
}

async function storeCell(block){
	return {
		text: await formatText(block.string),
		align: (block["text-align"] || "left").charAt(0)
	};
}

async function makeTable(block, start_indent = 0, extra = ""){
	const table_indent = "\t".repeat(start_indent);

	const afterTextMatch = Array.from(block.string.matchAll(/\{\{(?:\[\[)?table(?:\]\])?\}\}(.+)/g))[0] || false;
	// Below is the same structure as with figures rendering
	const labelRegex = /(`.+?`)/g;
	const labelMatch = Array.from(extra.matchAll(labelRegex))[0] || false;
	const labelEl = labelMatch ? `${table_indent}\\label{table:${labelMatch[0].slice(1,-1)}}\n` : "";

	const desc = extra.replace(labelRegex, "").trim();
	const descEl = (desc.length > 0) ? `${table_indent}\\caption{${await formatText(afterTextMatch[1].trim())}}\n` : "";

	const rows = await traverseTable(block);

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
	makeTable,
	traverseTable
};