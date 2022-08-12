export const sampleTable = {
	string: "{{table}} Table caption, à la Lorem ipsum",
	order: 0,
	children: [
		{
			string: "Col1 Header",
			order: 0,
			"text-align": "left",
			children: [
				{
					string: "Col2 Header",
					order: 0,
					"text-align": "center",
					children: [
						{
							string: "Col3 Header",
							order: 0,
							"text-align": "center"
						}
					]
				}
			]
		},
		{
			string: "Cell1",
			order: 0,
			children: [
				{
					string: "Cell2",
					order: 0,
					children: [
						{
							string: "Cell3",
							order: 0
						}
					]
				}
			]
		}
	]
};