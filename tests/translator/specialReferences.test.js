import REGEX from "../../src/translator/regex";
import parseSpecialReferences from "../../src/translator/specialReferences";

import { asyncReplaceAll } from "../../src/utils";


describe("Parsing references to special elements", () => {

	const cases = [
		[
			"Figure reference",
			"Some text, which references a figure {{fig: my awesome figure}}",
			"Some text, which references a figure \\ref{fig: my awesome figure}"
		],
		[
			"Table reference",
			"Some text, which references a table ({{table: my cool table}})",
			"Some text, which references a table (\\ref{table: my cool table})"
		],
		[
			"Equation reference",
			"Some text, which references an equation {{eq: my fancy equation}}",
			"Some text, which references an equation \\ref{eq: my fancy equation}"
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.specialRef, parseSpecialReferences))
				.toBe(expectation);
		}
	);
});