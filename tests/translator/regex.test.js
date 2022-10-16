import REGEX from "../../src/translator/regex";


describe("doubleBrackets regex", () => {
	const cases = [
		["some [[reference]]", "some reference"],
		["a random [[", "a random "],
		["a random ]]", "a random "],
		["some image ![](http://example.com)", "some image ![](http://example.com)"]
	];

	test.each(cases)(
		"%# - %s",
		(target, expectation) => {
			expect(target.replaceAll(REGEX.doubleBrackets, ""))
				.toBe(expectation);
		}
	);
});