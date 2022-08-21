import { DEFAULT_OUTPUT, ExportManager } from "../src/extension";
import { pageUIDWithFigure } from "../mocks/roam";


const mockBlob = new Blob([{ some: "content" }]);

jest.mock("jszip", () => ({
	generateAsync: () => Promise.resolve(mockBlob)
}));

beforeEach(() => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		blob: () => Promise.resolve(mockBlob)
	}));
	global.URL.createObjectURL = jest.fn().mockImplementation(() => "blob://some-url");
	global.URL.revokeObjectURL = jest.fn();

	window.latexRoam = new ExportManager();
});

afterEach(() => {
	global.fetch.mockClear();
	delete global.fetch;
	window.latexRoam.resetExport();
});

test("Add bibliography & blob", () => {
	expect(window.latexRoam.bib)
		.toEqual(DEFAULT_OUTPUT.bib);

	window.latexRoam.addBibliography("Sample bibliography");

	expect(window.latexRoam.bib)
		.toMatchObject({
			content: "Sample bibliography",
			blobURL: "blob://some-url"
		});
    
	expect(window.latexRoam.bib.blob).toBeInstanceOf(Blob);

});

test("Add figure & blob", async() => {
	expect(window.latexRoam.figs)
		.toEqual(DEFAULT_OUTPUT.figs);

	const figIndex = await window.latexRoam.addFigure("http://example.com", "png");

	expect(figIndex).toBe(1);
	expect(window.latexRoam.figs)
		.toMatchObject({
			list: [
				{ name: "figure-1.png" }
			]
		});
	expect(window.latexRoam.figs.list[0].input).toBeInstanceOf(Blob);
});

test("Generating export", async() => {
	const config = {
		document_class: "article",
		numbered: false,
		cover: false,
		start_header: "1",
		authors: "Some authors",
		title: "Some title"
	};

	const output = await window.latexRoam.generateExport(
		pageUIDWithFigure, 
		config
	);

	expect(output.figs.blob).toBeInstanceOf(Blob);
	expect(output.figs.blobURL).toBe("blob://some-url");

	expect(output.package.blob).toBeInstanceOf(Blob);
	expect(output.package.blobURL).toBe("blob://some-url");

});

test("Logging", () => {
	expect(window.latexRoam.logger)
		.toEqual({
			errors: [],
			warnings: []
		});
    
	window.latexRoam.error("sample message");

	expect(window.latexRoam.logger.errors)
		.toEqual(["sample message"]);
    
	window.latexRoam.warn("sample warning");

	expect(window.latexRoam.logger.warnings)
		.toEqual(["sample warning"]);
    
	window.latexRoam.resetExport();

	expect(window.latexRoam.logger)
		.toEqual({
			errors: [],
			warnings: []
		});
});