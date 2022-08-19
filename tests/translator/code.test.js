import { codeBlock, codeInline, parseCodeBlock, parseCodeInline } from "../../src/translator/code";

import REGEX from "../../src/translator/regex";

const sampleCodeBlock = 
`function myFunc(){
    return;
}`;

const blockTranslation =
`\\begin{verbatim}
function myFunc(){
    return;
}
\\end{verbatim}`;


describe("Code blocks are formatted into correct LaTeX", () => {
	test("LaTeX is correct", () => {
		expect(codeBlock(sampleCodeBlock))
			.toEqual(blockTranslation);
	});

	test("Replacement is correct", () => {
		const input = "Some text, then a code block:\n```\n" + sampleCodeBlock + "\n```";
		expect(input.replaceAll(REGEX.codeBlock, parseCodeBlock))
			.toEqual("Some text, then a code block:\n" + blockTranslation);
	});
});

describe("Inline code is formatted into correct LaTeX", () => {
	test("LaTeX is correct", () => {
		const sampleCode = "function myFunc(){return;}";
		const translation = "\\verb|function myFunc(){return;}|";
        
		expect(codeInline(sampleCode))
			.toEqual(translation);
	});

	test("Replacement is correct", () => {
		const input = "Some inline code like `myFunc()`, with surrounding content";
		expect(input.replaceAll(REGEX.codeInline, parseCodeInline))
			.toEqual("Some inline code like \\verb|myFunc()|, with surrounding content");
	});
});