import REGEX from "../../src/translator/regex";
import { asyncReplaceAll } from "../../src/utils";

import { doublePar, parseBlockAlias, parseDoublePars } from "../../src/translator/doublePar";

import { defaultUID, sampleBlocks } from "../../mocks/roam";


describe("Parsing content inside of double parentheses", () => {
	const cases = [
		[defaultUID, "raw", sampleBlocks[defaultUID].string],
		[defaultUID, "latex", sampleBlocks[defaultUID].string],
		["Parenthesised text", "raw", "Parenthesised text"],
		["Parenthesised text", "latex", "\\footnote{Parenthesised text}"]
	];

	test.each(cases)(
		"%# - %s (mode: %s)",
		async(content, mode, expectation) => {
			expect(await doublePar(content, mode))
				.toBe(expectation);
		}
	);
});

describe("Replace all - Double parentheses", () => {
	const cases = [
		[
			"Regular text",
			"This is reminiscent of X's model ((see Their Work)) and Y's work ((see their Model)) also",
			"This is reminiscent of X's model \\footnote{see Their Work} and Y's work \\footnote{see their Model} also"
		],
		[
			"Block UID",
			`Refer to ((${defaultUID}))`,
			"Refer to " + sampleBlocks[defaultUID].string
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.doublePar, parseDoublePars))
				.toBe(expectation);
		}
	);
});

describe("Replace all - Block aliases", () => {
	const cases = [
		[
			"Block with simple text",
			`This is reminiscent of [X's model](((${defaultUID}))) of the same problem`,
			`This is reminiscent of X's model \\footnote{${sampleBlocks[defaultUID].string}} of the same problem`
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.aliasBlock, parseBlockAlias))
				.toBe(expectation);
		}
	);
});
