import { act, renderHook } from "@testing-library/react-hooks";
import useBool from "./useBool";
import useSelect from "./useSelect";
import useText from "./useText";

describe("Hook for boolean state", () => {
	test("Toggle method", () => {
		const { result } = renderHook(() => useBool());
    
		expect(result.current[0]).toBe(false);
    
		act(() => {
			result.current[1].toggle();
		});
    
		expect(result.current[0]).toBe(true);
	});

	test("Set method", () => {
		const { result } = renderHook(() => useBool());
        
		act(() => {
			result.current[1].set(true);
		});

		expect(result.current[0]).toBe(true);

		act(() => {
			result.current[1].set(false);
		});

		expect(result.current[0]).toBe(false);
	});

	test("Switch on", () => {
		const { result } = renderHook(() => useBool(false));

		act(() => {
			result.current[1].on();
		});

		expect(result.current[0]).toBe(true);
	});

	test("Switch off", () => {
		const { result } = renderHook(() => useBool(true));

		act(() => {
			result.current[1].off();
		});

		expect(result.current[0]).toBe(false);
	});
});

describe("Hook for single selection state", () => {
	test("Behavior with base config", () => {
		const { result } = renderHook(() => useSelect({}));

		expect(result.current[0]).toBe(null);

		act(() => {
			result.current[1]("Some value");
		});

		expect(result.current[0]).toBe("Some value");
	});

	test("With custom transform function", () => {
		function transform(value){
			return {
				title: value.toLowerCase()
			};
		}

		const { result } = renderHook(() => useSelect({ transform }));

		expect(result.current[0]).toBe(null);

		act(() => {
			result.current[1]("TEXT");
		});

		expect(result.current[0]).toEqual({
			title: "text"
		});
	});
});

test("Hook for text state", () => {
	const { result } = renderHook(() => useText());

	expect(result.current[0]).toBe("");

	act(() => {
		result.current[1]({ target: { value: "query" } });
	});

	expect(result.current[0]).toBe("query");
});
