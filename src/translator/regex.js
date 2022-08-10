

/** @constant {Object} The dictionary of RegExps */
const REGEX = {
	// Aliases
	aliasAll: /(?:^|[^!])\[(.+?)\]\((.+?)\)/g,
	aliasBlock: /(?!^| )\[(.+?)\]\({3}(.+?)\){3}/g,
	aliasPage: /\[([^\]]+?)\]\(\[\[(.+?)\]\]\)/g,

	// Embeds
	embedBlock: /\{{2}(\[{2})?embed(\]{2})?: ?\({2}(.+?)\){2}\}{2}/g,
	embedPage: /\{{2}(\[{2})?embed(\]{2})?: ?\[{2}(.+?)\]{2}\}{2}/g,

	// Groupings and pages
	doublePar: /\({2}([^()]+?)\){2}/g,
	doubleBraces: /\{{2}(.+?)\}{2}/g,
	// Note: this will target all instances of `[[` and `]]`, even if they're not page references.
	doubleBrackets: /(\[|\]){2}/g,
	tag: /(?!^| )#(.+?)( |$)/g,
	
	// Citations
	refCitekey: /\[{2}@(.+?)\]{2}/g,
	citekeyList: /\((.*?)(\[{2}@.+?\]{2})((?: ?[,;] ?\[{2}@.+?\]{2}){1,})(.*?)\)/g,
	citekeyPar: /\(([^)]*?)\[{2}@([^)]+?)\]{2}([^)]*?)\)/g,
	citekey: /(^|[^#])\[{2}@([^\]]+?)\]{2}/g,
	
	// Code
	codeBlock: /```([\s\S]+?)```/g,
	codeInline: /(?:^|[^`])`([^`]+?)`/g,
	
	// Markup
	bold: /\*{2}([^*]+?)\*{2}/g,
	italics: /_{2}([^_]+?)_{2}/g,
	highlight: /\^{2}([^^]+?)\^{2}/g,

	// Miscellaneous
	image: /!\[(.*?)\]\((.+?)\)(.*)/g,
	math: /\$\$([\s\S^$]+?)\$\$([\s\S]+)?/g,
	table: /\{{2}(\[{2})?table(\]{2})?\}{2}(.*)/g,
	
	// Special references
	specialRef: /\{{2}(fig|eq|table):(.+?)\}{2}/g
};

export default REGEX;