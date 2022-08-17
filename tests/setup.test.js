import { setupInitialSettings } from "../src/setup";

describe("Parsing initial user settings", () => {
	const defaults = {
		darkTheme: false
	};

	it("should return defaults if given no settings", () => {
		expect(JSON.stringify(setupInitialSettings({})))
			.toEqual(JSON.stringify(defaults));
	});
});