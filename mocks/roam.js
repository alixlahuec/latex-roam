// TODO: improve mock return values

export const defaultUID = "some_uid";
export const uidWithFormatting = "with_formatting";

export const sampleBlocks = {
	[uidWithFormatting]: {
		string: "Block with **bold text**, some ^^highlighting^^ ((see other work))",
		order: 0,
		heading: 0,
		"view-type": "document",
		"text-align": "left"
	},
	[defaultUID]: {
		string: "Text extracted from block reference",
		order: 0,
		heading: 0,
		"view-type": "bulleted",
		"text-align": "left"
	}
};

export function getBlockText(uid){
	return Object.keys(sampleBlocks).includes(uid) ? [[sampleBlocks[uid].string]] : [];
}

export function queryBlockContents(uid){
	return sampleBlocks[uid] || sampleBlocks[defaultUID];
}