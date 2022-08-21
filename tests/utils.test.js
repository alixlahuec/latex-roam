import { cleanUpHref, hasNodeListChanged, makeBibliography, sortRoamBlocks, todayDMY } from "../src/utils";

/* eslint-disable no-useless-escape */
describe("De-escaping LaTeX HREFs", () => {
	const cases = [
		[
			{ text: "Some text", url: "https://example.com/index?query=term\&index=key\%20name" },
			"\\href{https://example.com/index?query=term&index=key%20name}{Some text}"
		]
	];

	test.each(cases)(
		"%# - %s",
		({ text, url }, expectation) => {
			expect(cleanUpHref({ text, url }))
				.toBe(expectation);
		}
	);
});

describe("Checking for changes in a list of nodes", () => {
	const someDiv = document.createElement("div");
	const anotherDiv = document.createElement("div");

	test("Empty list doesn't get identified as a change", () => {
		expect(hasNodeListChanged([], []))
			.toBe(false);
	});

	test("Identical list doesn't get identified as a change", () => {
		expect(hasNodeListChanged([someDiv], [someDiv]))
			.toBe(false);
	});

	test("Non-empty list becoming empty is a change", () => {
		expect(hasNodeListChanged([someDiv], []))
			.toBe(true);
	});

	test("Empty list becoming non-empty is a change", () => {
		expect(hasNodeListChanged([], [someDiv]))
			.toBe(true);
	});

	test("Change in list contents is a change", () => {
		expect(hasNodeListChanged([someDiv], [anotherDiv]))
			.toBe(true);
		expect(hasNodeListChanged([someDiv], [someDiv, anotherDiv]))
			.toBe(true);
	});
});

describe("Calling zoteroRoam instance if exists", () => {
	const citekeys = ["someCitekey", "anotherCitekey"];

	afterEach(() => {
		if(window.zoteroRoam){
			delete window.zoteroRoam;
		}
	});

	test("No zoteroRoam instance available", () => {
		return expect(makeBibliography(citekeys)).rejects
			.toEqual(new Error("No instance of zoteroRoam was found : bibliography won't be generated."));
	});

	test("No bibliography util is exposed by the zoteroRoam instance", () => {
		window.zoteroRoam = {};
		return expect(makeBibliography(citekeys)).rejects
			.toEqual(new Error("The zoteroRoam instance does not expose bibliography data : no bibliography will be generated."));
	});

	test("Bibliography util is available", async() => {
		window.zoteroRoam = {
			getBibEntries: jest.fn(() => "The bibliography")
		};
		
		const bib = await makeBibliography(citekeys);

		expect(window.zoteroRoam.getBibEntries)
			.toHaveBeenCalled();
		expect(window.zoteroRoam.getBibEntries)
			.toHaveBeenCalledWith(citekeys);
		expect(bib)
			.toBe("The bibliography");
	});
});

test("Sorting Roam blocks by block order", () => {
	const blocks = [
		{ order: 1 },
		{ order: 8 },
		{ order: 0 }
	];

	expect(sortRoamBlocks(blocks))
		.toEqual([
			blocks[2],
			blocks[0],
			blocks[1]
		]);
});

test("Formatting today's date in D/M/Y format", () => {
	jest.useFakeTimers("modern");
	jest.setSystemTime(new Date([2022, 1, 1]));

	expect(todayDMY())
		.toBe("01/01/2022");

	jest.useRealTimers();
});