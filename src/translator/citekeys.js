import REGEX from "./regex";

function citekeyList(first, list){
	const fullList = first + list;
	const citekeys = Array.from(fullList.matchAll(/(?:\[\[@)(.+?)(?:\]\])/g)).map(match => match[1]);
	return `\\cite{${citekeys.join(", ")}}`;
}

function parseCitekeyInline(_match, pre, citekey){
	return `${pre}\\textcite{${citekey}}`;
}

function parseCitekeyList(_match, pre, first, list, post){
	return `(${pre}${citekeyList(first,list)}${post})`;
}

function parseCitekeyPar(_match, pre, citekey, post){
	return `(${pre}\\cite{${citekey}}${post})`;
}

function replaceCitekeys(string){
	let output = string;
	// Lists within parentheses
	output = output.replaceAll(REGEX.citekeyList, parseCitekeyList);
	// Single citations within parentheses
	output = output.replaceAll(REGEX.citekeyPar, parseCitekeyPar);
	// Inline citations
	output = output.replaceAll(REGEX.citekey, parseCitekeyInline);

	return output;
}

export {
	parseCitekeyInline,
	parseCitekeyList,
	parseCitekeyPar,
	replaceCitekeys
};