function parseDoubleBraces(match, capture){
	return (capture.includes("iframe") || capture.includes("word-count") || capture.includes("=:")) 
		? "" 
		: match;
}

export default parseDoubleBraces;