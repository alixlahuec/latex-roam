import REGEX from "../../src/translator/regex";
import { parseMathMode } from "../../src/translator/mathMode";

import { asyncReplaceAll } from "../../src/utils";


describe("Parsing inline math expressions", () => {

	const cases = [
		[
			"In-text equation",
			"Some text, which includes a $$LaTeX$$ equation and continues on",
			"Some text, which includes a $LaTeX$ equation and continues on"
		],
		[
			"Standalone equation - no label",
			"$$LaTeX math$$",
			"\n\\begin{equation}\nLaTeX math\n\\end{equation}"
		],
		[
			"Standalone equation - with label",
			"$$LaTeX math$$ `amazing math`",
			"\n\\begin{equation}\n\\label{eq:amazing math}LaTeX math\n\\end{equation}"
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.math, parseMathMode))
				.toBe(expectation);
		}
	);
});