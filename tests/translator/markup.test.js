import { parseAlias, parseAliasPage, replaceTextFormatting } from "../../src/translator/markup";
import REGEX from "../../src/translator/regex";


describe("Replace bold, italics, highlights", () => {
	const cases = [
		["Bold only", "Some **bolded** text", "Some \\textbf{bolded} text"],
		["Italics only", "Some __italics__ content", "Some \\textit{italics} content"],
		["Highlight only", "Some ^^highlighted^^ word", "Some \\hl{highlighted} word"],
		["Bold within italics", "Some __**double-formatted**__ phrase", "Some \\textit{\\textbf{double-formatted}} phrase"],
		["Italics within bold", "Some **__double-formatted__** phrase", "Some \\textbf{\\textit{double-formatted}} phrase"],
		["Bold within highlight", "Another ^^**double-formatted**^^ piece", "Another \\hl{\\textbf{double-formatted}} piece"],
		["Italics within highlight", "Another ^^__double-formatted__^^ piece", "Another \\hl{\\textit{double-formatted}} piece"],
		["Bold + italics + highlight", "^^**__Triple-formatted__ bout of a** sentence^^", "\\hl{\\textbf{\\textit{Triple-formatted} bout of a} sentence}"]
	];

	test.each(cases)(
		"%# - %s",
		(_id, input, expectation) => {
			expect(replaceTextFormatting(input))
				.toBe(expectation);
		}
	);
});

describe("Parse aliases", () => {
	const cases = [
		[
			"Any alias",
			[
				"Some [outbound link](http://example.com)",
				REGEX.aliasAll,
				parseAlias,
				"Some \\href{http://example.com}{outbound link}"
			]
		],
		[
			"Page alias",
			[
				"Some [page alias]([[Page Title]])",
				REGEX.aliasPage,
				parseAliasPage,
				"Some page alias"
			]
		]
	];

	test.each(cases)(
		"%# - %s",
		(_id, [input, regex, replaceFn, expectation]) => {
			expect(input.replaceAll(regex, replaceFn))
				.toBe(expectation);
		}
	);
});