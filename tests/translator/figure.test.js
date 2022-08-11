import REGEX from "../../src/translator/regex";
import { parseImage } from "../../src/translator/figure";

import { asyncReplaceAll } from "../../src/utils";


beforeEach(() => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		blob: () => Promise.resolve(new Blob([{ some: "image" }]))
	}));
});

afterEach(() => {
	global.fetch.mockClear();
	delete global.fetch;
});

describe("Parsing inline images", () => {

	beforeAll(() => {
		window.latexRoam = {
			addFigure: jest.fn(() => 1)
		};
	});

	const cases = [
		[
			"Simple text caption - no label, no description",
			"Some text, with a figure: ![A caption](http://example.com/myfigure.png)",
			"Some text, with a figure: \\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-1.png}\n\\caption{A caption}\n\\end{figure}"
		],
		[
			"Simple text caption - with label, no description",
			"Some text, with a figure: ![A caption](http://example.com/myfigure.png) `an awesome figure`",
			"Some text, with a figure: \\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-1.png}\n\\caption{A caption}\n\\label{fig:an awesome figure}\n\\end{figure}"
		],
		[
			"Simple text caption - no label, with simple text description",
			"Some text, with a figure: ![A caption](http://example.com/myfigure.png) Additional description ensues.",
			"Some text, with a figure: \\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-1.png}\n\\caption{A caption}\n\\medskip\nAdditional description ensues.\n\\end{figure}"
		],
		[
			"Simple text caption - with label, with simple text description",
			"Some text, with a figure: ![A caption](http://example.com/myfigure.png) `an awesome figure` Additional description ensues.",
			"Some text, with a figure: \\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-1.png}\n\\caption{A caption}\n\\label{fig:an awesome figure}\n\\medskip\nAdditional description ensues.\n\\end{figure}"
		],
		[
			"Formatted text caption - with label, with simple text description",
			"Some text, with a figure: ![A **bold** caption](http://example.com/myfigure.png) `an awesome figure` Additional description ensues.",
			"Some text, with a figure: \\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-1.png}\n\\caption{A \\textbf{bold} caption}\n\\label{fig:an awesome figure}\n\\medskip\nAdditional description ensues.\n\\end{figure}"
		],
		[
			"Simple text caption - with label, with formatted description",
			"Some text, with a figure: ![A caption](http://example.com/myfigure.png) `an awesome figure` Additional ^^highlight^^ ensues.",
			"Some text, with a figure: \\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-1.png}\n\\caption{A caption}\n\\label{fig:an awesome figure}\n\\medskip\nAdditional \\hl{highlight} ensues.\n\\end{figure}"
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.image, parseImage))
				.toBe(expectation);
		}
	);
});