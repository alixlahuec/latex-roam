const sampleListElements = [
	{
		order: 0,
		string: "A list element"
	},
	{
		order: 1,
		string: "Another list element"
	},
	{
		order: 2,
		string: "A **formatted** block",
		children: [
			{
				order: 0,
				string: "A grandchild"
			}
		]
	}
];

export const sampleBulletedList = {
	string: "A bulleted list:",
	order: 0,
	"view-type": "bulleted",
	children: sampleListElements
};

export const sampleDocumentList = {
	string: "A document list:",
	order: 0,
	"view-type": "document",
	children: sampleListElements
};

export const sampleNumberedList = {
	string: "A numbered list:",
	order: 0,
	"view-type": "numbered",
	children: sampleListElements
};