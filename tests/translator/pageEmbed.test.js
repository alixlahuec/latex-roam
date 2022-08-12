import { grabRawText, raw } from "../../src/translator/common";
import REGEX from "../../src/translator/regex";

import { pageEmbed, parsePageEmbed } from "../../src/translator/pageEmbed";

import { defaultPageTitle, defaultUID, emptyPageTitle, sampleBlocks, samplePages } from "../../mocks/roam";
import { asyncReplaceAll } from "../../src/utils";


describe("Parsing content of page embeds", () => {
	const cases = [
		[defaultPageTitle, "raw", async() => await grabRawText(samplePages[defaultPageTitle])],
		[defaultPageTitle, "latex", async() => `${defaultPageTitle}\\${await raw(sampleBlocks[defaultUID], 0)}`],
		[emptyPageTitle, "latex", () => emptyPageTitle]
	];

	test.each(cases)(
		"%# - %s (mode: %s)",
		async(uid, mode, expectation) => {
			expect(await pageEmbed(uid, mode))
				.toBe(await expectation());
		}
	);
});

describe("Replace all - Page embeds", () => {
	const cases = [
		[
			"Page embed, no brackets",
			`This is reminiscent of {{embed: [[${defaultPageTitle}]]}}`,
			async() => `This is reminiscent of ${defaultPageTitle}\\${await raw(sampleBlocks[defaultUID], 0)}`
		],
		[
			"Page embed, with brackets",
			`This is reminiscent of {{[[embed]]: [[${defaultPageTitle}]]}}`,
			async() => `This is reminiscent of ${defaultPageTitle}\\${await raw(sampleBlocks[defaultUID], 0)}`
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.embedPage, parsePageEmbed))
				.toBe(await expectation());
		}
	);
});