import { grabRawText, raw } from "../../src/translator/common";
import REGEX from "../../src/translator/regex";

import { blockEmbed, parseBlockEmbed } from "../../src/translator/blockEmbed";

import { defaultUID, sampleBlocks, uidWithFormatting } from "../../mocks/roam";
import { asyncReplaceAll } from "../../src/utils";


describe("Parsing content of block embeds", () => {
	const cases = [
		[defaultUID, "raw", () => sampleBlocks[defaultUID].string],
		[defaultUID, "latex", () => sampleBlocks[defaultUID].string],
		[uidWithFormatting, "raw", async() => await grabRawText(sampleBlocks[uidWithFormatting])],
		[uidWithFormatting, "latex", async() => await raw(sampleBlocks[uidWithFormatting])],
	];

	test.each(cases)(
		"%# - %s (mode: %s)",
		async(uid, mode, expectation) => {
			expect(await blockEmbed(uid, mode))
				.toBe(await expectation());
		}
	);
});

describe("Replace all - Block embeds", () => {
	const cases = [
		[
			"Block with simple text, no brackets",
			`This is reminiscent of {{embed: ((${defaultUID}))}}`,
			() => `This is reminiscent of ${sampleBlocks[defaultUID].string}`
		],
		[
			"Block with formatted text, with brackets",
			`This is reminiscent of {{[[embed]]: ((${uidWithFormatting}))}}`,
			async() => `This is reminiscent of ${await raw(sampleBlocks[uidWithFormatting])}`
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.embedBlock, parseBlockEmbed))
				.toBe(await expectation());
		}
	);
});