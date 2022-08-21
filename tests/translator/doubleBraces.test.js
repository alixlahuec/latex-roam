import REGEX from "../../src/translator/regex";
import { formatText } from "../../src/translator/common";
import parseDoubleBraces from "../../src/translator/doubleBraces";

import { defaultUID, uidWithFormatting } from "../../mocks/roam";

import { asyncReplaceAll } from "../../src/utils";


describe("Parsing content of double braces", () => {
	const cases = [
		[
			"Some text {{iframe: http://example.com}}", 
			() => "Some text"
		],
		[
			"{{word-count}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{[[POMO]]: 25}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{date}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{[[calc]]: ((uid))}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{slider}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{[[encrypt]]}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{diagram}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{[[drawing]]}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{kanban}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{[[mentions]]: ((uid))}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{character-count}} Paragraph", 
			() => "Paragraph"
		],
		[
			"{{[[query]]: {and: [[page]] [[other page]]} }} Paragraph", 
			() => "Paragraph"
		],
		[
			"Text with a {{=: popover|Some content}}", 
			() => "Text with a popover \\footnote{Some content}"
		],
		[
			`Text with a {{=: popover with block|((${defaultUID}))}}`, 
			async() => `Text with a popover with block \\footnote{${await formatText(`((${defaultUID}))`)}}`
		],
		[
			`Text with a {{=: popover with formatted block|((${uidWithFormatting}))}}`, 
			async() => `Text with a popover with formatted block \\footnote{${await formatText(`((${uidWithFormatting}))`)}}`
		],
		[
			"Text with a {{=: popover with formatted text|Some **bold text**}}", 
			() => "Text with a popover with formatted text \\footnote{Some \\textbf{bold text}}"
		],
		[
			"Click this {{button}}", 
			() => "Click this {{button}}"
		],
		[
			"Refer to {{embed: ((some_uid))", 
			() => "Refer to {{embed: ((some_uid))"
		],
	];

	test.each(cases)(
		"%# - %s",
		async(input, expectation) => {
			expect(await asyncReplaceAll(input, REGEX.doubleBraces, parseDoubleBraces))
				.toBe(await expectation());
		}
	);
});