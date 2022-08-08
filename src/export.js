import createTEX from "./translator/createTEX";

async function startExport(uid, config, handlers){
	const { authors, document_class, headersNumbered, startWithHeader, title, useCover } = config;
	const { resetOutput, updateTEX, zipFigures, zipPackage } = handlers;

	resetOutput();
	
	// Processing of page contents
	const texOutput = await createTEX(uid, document_class, { authors, cover: useCover, numbered: headersNumbered, start_header: Number(startWithHeader), title }, handlers);

	updateTEX(texOutput);
	// Prepare .zip of figures for download
	await zipFigures();
	// Prepare .zip of full package for download
	await zipPackage(title);

}

export default startExport;
