/* eslint-disable no-useless-escape */

/** @constant {Object} The dictionary of RegExps */
const REGEX = {
	// Aliases
	aliasAll: /(?:^|[^!])\[(.+?)\]\((.+?)\)/g,
	aliasBlock: /(?!^| )\[(.+?)\]\(\(\((.+?)\)\)\)/g,
	aliasPage: /\[([^\]]+?)\]\(\[\[(.+?)\]\]\)/g,

	// Embeds
	embedBlock: /\{{2}(\[\[)?embed(\]\])?: ?\(\((.+?)\)\)\}{2}/g,
	embedPage: /\{{2}(\[\[)?embed(\]\])?: ?\[\[(.+?)\]\]\}{2}/g,

	// Groupings and pages
	doublePar: /\(\(([^\(\)]+?)\)\)/g,
	doubleBraces: /\{\{(.+?)\}\}/g,
	// Note: this will target all instances of `[[` and `]]`, even if they're not page references.
	doubleBrackets: /(\[|\]){2}/g,
	tag: /(?!^| )\#(.+?)( |$)/g,
	
	// Citations
	refCitekey: /\[\[@(.+?)\]\]/g,
	citekeyList: /\((.*?)(\[\[@.+?\]\])((?: ?[,;] ?\[\[@.+?\]\]){1,})(.*?)\)/g,
	citekeyPar: /\(([^\)]*?)\[\[@([^\)]+?)\]\]([^\)]*?)\)/g,
	citekey: /(^|[^\#])\[\[@([^\]]+?)\]\]/g,
	
	// Code
	codeBlock: /```([\s\S]+?)```/g,
	codeInline: /(?:^|[^`])`([^`]+?)`/g,
	
	// Markup
	bold: /\*{2}([^\*]+?)\*{2}/g,
	italics: /_{2}([^_]+?)_{2}/g,
	highlight: /\^{2}([^\^]+?)\^{2}/g,

	// Miscellaneous
	image: /!\[(.*?)\]\((.+?)\)(.*)/g,
	math: /\$\$([\s\S^\$]+?)\$\$([\s\S]+)?/g,
	table: /{{\[{0,2}table\]{0,2}}}(.*)/g,
	
	// Special references
	specialRef: /\{\{(fig|eq|table)\:(.+?)\}\}/g
};

export default REGEX;