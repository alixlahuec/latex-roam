import REGEX from "../../src/translator/regex";

import { parseCitekeyInline, parseCitekeyList, parseCitekeyPar } from "../../src/translator/citekeys";

describe("Citation lists are correctly formatted", () => {
	const keys = ["citekey", "anotherCitekey", "someOtherCitekey"];
	const citekeys = keys.map(ck => `[[@${ck}]]`);
	const replace = `\\cite{${keys.join(", ")}}`;

	const cases = [
		[
			"Separated by semicolon",
			{ join: ";" }
		],
		[
			"Separated by comma",
			{ join: "," }
		],
		[
			"Separated by semicolon, spaced",
			{ join: " ; " }
		],
		[
			"Separated by comma, spaced",
			{ join: " , " }
		],
		[
			"With additional prefix",
			{ prefix: "see ", join: ";" }
		],
		[
			"With additional suffix",
			{ join: ",", suffix: " ; and many others" }
		]
	];

	test.each(cases)(
		"%# - %s",
		(_id, input) => {
			const { prefix = "", join, suffix = "" } = input;
			const string = ["(", prefix, citekeys.join(join), suffix, ")"].join("");
			const output = string.replaceAll(REGEX.citekeyList, parseCitekeyList);
			expect(output)
				.toBe(`(${prefix}${replace}${suffix})`);
		}
	);
});

describe("Single parenthesised citations are correctly formatted", () => {
	const cases = [
		[
			"With prefix",
			"(see [[@citekey]])",
			"(see \\cite{citekey})"
		],
		[
			"Alone",
			"([[@citekey]])",
			"(\\cite{citekey})"
		],
		[
			"With suffix",
			"([[@citekey]] discusses this in depth)",
			"(\\cite{citekey} discusses this in depth)"
		],
		[
			"With prefix + suffix",
			"(see [[@citekey]], who discusses this in depth)",
			"(see \\cite{citekey}, who discusses this in depth)"
		]
	];

	test.each(cases)(
		"%# - %s",
		(_id, string, expectation) => {
			const output = string.replaceAll(REGEX.citekeyPar, parseCitekeyPar);
			expect(output)
				.toBe(expectation);
		}
	);
});

describe("Inline citations are correctly formatted", () => {
	const cases = [
		[
			"With prefix",
			"Some, like [[@citekey]]",
			"Some, like \\textcite{citekey}"
		],
		[
			"With suffix",
			"[[@citekey]] claim",
			"\\textcite{citekey} claim"
		],
		[
			"With prefix + suffix",
			"Some, like [[@citekey]], claim",
			"Some, like \\textcite{citekey}, claim"
		]
	];

	test.each(cases)(
		"%# - %s",
		(_id, string, expectation) => {
			const output = string.replaceAll(REGEX.citekey, parseCitekeyInline);
			expect(output)
				.toBe(expectation);
		}
	);
});