import REGEX from "./regex";

function parseAlias(_match, p1, p2){
	return ` \\href{${p2}}{${p1}}`;
}

function parseAliasPage(_match, p1){
	return p1;
}

function parseBold(_match, p1){
	return `\\textbf{${p1}}`;
}

function parseHighlight(_match, p1){
	return `\\hl{${p1}}`;
}

function parseItalics(_match, p1){
	return `\\textit{${p1}}`;
}

function replaceTextFormatting(string){
	let output = string;
	// Bold markup
	output = output.replaceAll(REGEX.bold, parseBold);
	// Italic markup
	output = output.replaceAll(REGEX.italics, parseItalics);
	// Highlight markup
	output = output.replaceAll(REGEX.highlight, parseHighlight);

	return output;
}

export {
	parseAlias,
	parseAliasPage,
	parseBold,
	parseHighlight,
	parseItalics,
	replaceTextFormatting
};