import { useCallback, useState } from "react";

import { DEFAULT_OUTPUT } from "../extension";
import useBool from "./useBool";

const useExport = ({ uid }) => {
	const [output, setOutput] = useState({ ...DEFAULT_OUTPUT });
	const [isLoading, { on: hasStartedLoading, off: isDoneLoading }] = useBool(false);

	const resetOutput = useCallback(() => setOutput({ ...DEFAULT_OUTPUT }), []);

	const triggerExport = useCallback(async(config) => {
		hasStartedLoading();

		const client = window.latexRoam;
		client.resetExport();
		
		const exportOutput = await client.generateExport(uid, config);
		setOutput(exportOutput);
		isDoneLoading();

	}, [uid, hasStartedLoading, isDoneLoading]);

	return [output, { isLoading, resetOutput, triggerExport }];
};
useExport.propTypes = {

};

export default useExport;