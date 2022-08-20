function codeBlock(capture){
	return `\\begin{verbatim}\n${capture}\n\\end{verbatim}`;
}

function codeInline(capture){
	return `\\verb|${capture}|`;
}

function parseCodeBlock(_match, _language, code){
	return codeBlock(code);
}

function parseCodeInline(_match, capture){
	return ` ${codeInline(capture)}`;
}

export {
	codeBlock,
	codeInline,
	parseCodeBlock,
	parseCodeInline
};