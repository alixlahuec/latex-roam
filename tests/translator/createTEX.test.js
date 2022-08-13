import { _createTEX, makeHeader, makeList, parseBlock } from "../../src/translator/createTEX";
import { todayDMY } from "../../src/utils";

import { defaultPageUID, defaultUID, pageUIDWithHeader, plainBlock, sampleBlocks } from "../../mocks/roam";
import { sampleBulletedList, sampleDocumentList, sampleNumberedList } from "../../mocks/content/lists";


describe("Parsing headings", () => {
	const cases = [
		[
			"Simple text - book format, level 1, not numbered",
			[
				"Some Title",
				{
					document_class: "book",
					numbered: false,
					level: 1
				},
				"\\chapter*{Some Title}\n"
			]
		],
		[
			"Simple text - report format, level 2, numbered",
			[
				"Some Title",
				{
					document_class: "report",
					numbered: true,
					level: 2
				},
				"\\section{Some Title}\n"
			]
		],
		[
			"Simple text - article format, level 2, not numbered",
			[
				"Some Title",
				{
					document_class: "article",
					numbered: false,
					level: 2
				},
				"\\subsection*{Some Title}\n"
			]
		],
		[
			"Simple text - book format, level 4, numbered",
			[
				"Some Title",
				{
					document_class: "book",
					numbered: true,
					level: 4
				},
				"\\subsubsection{Some Title}\n"
			]
		],
		[
			"Simple text - article format, level 4, not numbered",
			[
				"Some Title",
				{
					document_class: "article",
					numbered: false,
					level: 4
				},
				"Some Title\\\\"
			]
		]
		
	];

	test.each(cases)(
		"%# - %s",
		async(_id, [input, { document_class, numbered, level }, expectation]) => {
			expect(await makeHeader(input, { document_class, numbered, level }))
				.toBe(expectation);
		}
	);
});

describe("Parsing list blocks", () => {
	const cases = [
		[
			"Bulleted list",
			sampleBulletedList,
			[
				"A bulleted list:",
				"\\begin{itemize}",
				"\t\\item{A list element}",
				"\t\\item{Another list element}",
				"\t\\item{A \\textbf{formatted} block}",
				"\t\t\\begin{itemize}",
				"\t\t\t\\item{A grandchild}",
				"\t\t\\end{itemize}",
				"\\end{itemize}"
			].join("\n")
		],
		[
			"Document list",
			sampleDocumentList,
			[
				"A document list:\\\\",
				"A list element\\\\Another list element\\\\A \\textbf{formatted} block",
				// If a block with children isn't in `document` mode, it defaults to a bulleted list
				"\\begin{itemize}",
				"\t\\item{A grandchild}",
				"\\end{itemize}"
			].join("\n")
		],
		[
			"Numbered list",
			sampleNumberedList,
			[
				"A numbered list:",
				"\\begin{enumerate}",
				"\t\\item{A list element}",
				"\t\\item{Another list element}",
				"\t\\item{A \\textbf{formatted} block}",
				"\t\t\\begin{itemize}",
				"\t\t\t\\item{A grandchild}",
				"\t\t\\end{itemize}",
				"\\end{enumerate}"
			].join("\n")
		]
	];

	test.each(cases)(
		"%# - %s",
		async(_id, block, expectation) => {
			expect(await parseBlock(block))
				.toBe(expectation);
		}
	);

	test("Parsing list elements", async() => {
		expect(await makeList([sampleDocumentList], "bulleted", 0))
			.toBe(
				[
					"\\begin{itemize}",
					"\t\\item{A document list:\\\\A list element\\\\Another list element\\\\A \\textbf{formatted} block\\\\A grandchild}",
					"\\end{itemize}"
				].join("\n")
			);
	});

});

describe("Generating TEX document with settings", () => {
	const cases = [
		[
			defaultPageUID,
			{
				document_class: "book",
				numbered: false,
				cover: false,
				start_header: "1",
				authors: "Some authors",
				title: "Some title"
			},
			sampleBlocks[defaultUID].string
		],
		[
			pageUIDWithHeader,
			{
				document_class: "book",
				numbered: false,
				cover: false,
				start_header: "1",
				authors: "Some authors",
				title: "Some title"
			},
			[
				"Header Text\\\\",
				plainBlock.string
			].join("\n")
		]
	];

	test.each(cases)(
		"%# - %s",
		async(uid, { document_class, numbered, cover, start_header, authors, title }, expectation) => {
			expect(await _createTEX(uid, document_class, { numbered, cover, start_header, authors, title }))
				.toBe(
					[
						`\n\\documentclass{${document_class}}`,
						`\\title{${title}}`,
						`\\author{${authors}}`,
						`\\date{${todayDMY()}}`,
						"\n\\usepackage{amsmath}",
						"\\usepackage{graphicx}",
						"\\usepackage{soul}",
						"\\usepackage{hyperref}",
						"\\hypersetup{colorlinks=true,citecolor=black}",
						"\n\\begin{document}",
						`${cover ? "\\maketitle" : ""}`,
						"\n" + expectation,
						"\n\\end{document}"
					].join("\n")
				);
		}
	);
});