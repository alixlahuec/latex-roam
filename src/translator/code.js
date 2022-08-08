function codeBlock(capture){
	return `\\begin{verbatim}\n${capture}\n\\end{verbatim}`;
}

function codeInline(capture){
	return `\\verb|${capture}|`;
}

function parseCodeBlock(_match, capture){
	return codeBlock(capture);
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