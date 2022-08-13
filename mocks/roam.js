// TODO: improve mock return values

export const defaultUID = "some_uid";
export const uidWithFormatting = "with_formatting";
export const defaultPageUID = "some_page_uid";
export const pageUIDWithFigure = "some_page_with_fig";
export const pageUIDWithHeader = "some_page_with_header";

export const plainBlock = {
	string: "Text extracted from block reference",
	order: 0,
	"view-type": "bulleted",
	"text-align": "left"
};

const imageBlock = {
	string: "Text with an ![image](http://example.com/figure.png)",
	order: 0
};

const headerBlock = {
	string: "Header Text",
	order: 0,
	heading: 1,
	children: [
		plainBlock
	]
};

export const sampleBlocks = {
	[uidWithFormatting]: {
		string: "Block with **bold text**, some ^^highlighting^^ ((see other work))",
		order: 0,
		heading: 0,
		"view-type": "document",
		"text-align": "left"
	},
	[defaultUID]: plainBlock,
	[defaultPageUID]: {
		title: defaultPageTitle,
		children: [
			plainBlock
		],
		"view-type": "bulleted",
		"text-align": "left"
	},
	[pageUIDWithFigure]: {
		title: "Page with Figure",
		children: [
			imageBlock
		],
		"view-type": "bulleted",
		"text-align": "left"
	},
	[pageUIDWithHeader]: {
		title: "Page with Header",
		children: [
			headerBlock
		]
	}
};

export const defaultPageTitle = "Some Title";
export const emptyPageTitle = "An Empty Page";

export const samplePages = {
	[defaultPageTitle]: {
		title: defaultPageTitle,
		children: [
			sampleBlocks[defaultUID]
		],
		"view-type": "bulleted",
		"text-align": "left"
	},
	[emptyPageTitle]: {
		title: emptyPageTitle,
		"view-type": "document",
		"text-align": "left"
	}
};

export function getBlockText(uid){
	return Object.keys(sampleBlocks).includes(uid) ? [[sampleBlocks[uid].string]] : [];
}

export function queryBlockContents(uid){
	return sampleBlocks[uid] || sampleBlocks[defaultUID];
}

export function queryPageContentsByTitle(title){
	return samplePages[title] || samplePages[defaultPageTitle];
}