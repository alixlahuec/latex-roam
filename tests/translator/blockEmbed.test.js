import { blockEmbed, parseBlockEmbed } from "../../src/translator/blockEmbed";

import { defaultUID, sampleBlocks, uidWithFormatting } from "../../mocks/roam";
import { grabRawText, raw } from "../../src/translator/common";


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
