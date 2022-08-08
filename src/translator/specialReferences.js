function parseSpecialReferences(_match, type, label){
	return `\\ref{${type}:${label}}`;
}

export default parseSpecialReferences;