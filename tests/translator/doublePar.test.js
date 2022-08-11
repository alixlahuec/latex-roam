import REGEX from "../../src/translator/regex";
import { asyncReplaceAll } from "../../src/utils";
import doublePar from "../../src/translator/doublePar";

import { defaultUID, sampleBlocks } from "../../mocks/roam";


describe("Parsing content inside of double parentheses", () => {
	test("Block reference - raw, simple text", async() => {
		expect(await doublePar(defaultUID, "raw"))
			.toBe(sampleBlocks[defaultUID].string);
	});
	test("Block reference - LaTeX, simple text", async() => {
		expect(await doublePar(defaultUID, "latex"))
			.toBe(sampleBlocks[defaultUID].string);
	});
	test("Simple text - raw", async() => {
		expect(await doublePar("Parenthesised text", "raw"))
			.toBe("Parenthesised text");
	});
	test("Simple text - LaTeX", async() => {
		expect(await doublePar("Parenthesised text", "latex"))
			.toBe("\\footnote{Parenthesised text}");
	});
});

test("Replace all - Double parentheses", async() => {
	const input = "This is reminiscent of X's model ((see Their Work)) and Y's work ((see their Model)) also";

	expect(await asyncReplaceAll(input, REGEX.doublePar, async(_match, p1) => await doublePar(p1, "latex")))
		.toBe("This is reminiscent of X's model \\footnote{see Their Work} and Y's work \\footnote{see their Model} also");
    
	const withBlockRef = `Refer to ((${defaultUID}))`;
    
	expect(await asyncReplaceAll(withBlockRef, REGEX.doublePar, async(_match, p1) => await doublePar(p1, "latex")))
		.toBe("Refer to " + sampleBlocks[defaultUID].string);
});

test("Replace all - Block aliases", async() => {
	const input = `This is reminiscent of [X's model](((${defaultUID}))) of the same problem`;

	// Debugging because the real code causes an infinite loop
	expect(await asyncReplaceAll(input, REGEX.aliasBlock, async(_match, p1, p2) => `${p1} \\footnote{${await doublePar(p2, "raw")}}`))
		.toBe(`This is reminiscent of X's model \\footnote{${sampleBlocks[defaultUID].string}} of the same problem`);
});
