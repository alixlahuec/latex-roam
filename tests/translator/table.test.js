import { isTableBlock, makeTable, traverseTable } from "../../src/translator/table";

import { sampleTable } from "../../mocks/content/tables";


describe("Detecting table blocks", () => {
	const cases = [
		["", false],
		["table", false],
		["{table}", false],
		["{{Table}}", false],
		["{{table}}", ""],
		["Some text, then a {{table}}", ""],
		[sampleTable.string, " Table caption, à la Lorem ipsum"]
	];

	test.each(cases)(
		"%# - %s",
		(string, expectation) => {
			expect(isTableBlock(string))
				.toBe(expectation);
		}
	);
});

test("Parsing table contents", async() => {
	expect(await traverseTable(sampleTable))
		.toEqual([
			[
				{ text: "Col1 Header", align: "l" },
				{ text: "Col2 Header", align: "c" },
				{ text: "Col3 Header", align: "c" }
			],
			[
				{ text: "Cell1", align: "l" },
				{ text: "Cell2", align: "l" },
				{ text: "Cell3", align: "l" }
			]
		]);
});

test("Generating table LaTeX", async () => {
	expect(await makeTable(sampleTable, 0, " Table caption, à la Lorem ipsum"))
		.toBe(
			[
				"\\begin{table}[h!]",
				"\\centering",
				"\\begin{tabular}{l c c}",
				"\t\\hline",
				"\tCol1 Header & Col2 Header & Col3 Header \\\\",
				"\tCell1 & Cell2 & Cell3 \\\\",
				"\t\\hline",
				"\\end{tabular}",
				"\\caption{Table caption, à la Lorem ipsum}",
				"\\end{table}"
			].join("\n")
		);
});