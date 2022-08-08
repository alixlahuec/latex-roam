import React, { useCallback, useContext, useMemo, useState } from "react";
import { node } from "prop-types";

import { downloadZip } from "client-zip";


const emptyOutput = {
	tex: {
		content: "",
		blob: null,
		blobURL: null
	},
	bib: {
		content: "",
		blob: null,
		blobURL: null
	},
	figs: {
		list: [],
		blob: null,
		blobURL: null
	},
	full_package: {
		blob: null,
		blobURL: null
	}
};

const ExportContext = React.createContext();

const ExportContextProvider = ({ children }) => {
	const [output, setOutput] = useState(() => emptyOutput);

	const resetOutput = useCallback(() => {
		setOutput(prevState => {
			// Clean artifacts
			const { bib, figs, tex } = prevState;
			if(figs.blob != null){ URL.revokeObjectURL(figs.blobURL); }
			if(bib.blob != null){ URL.revokeObjectURL(bib.blobURL); }
			if(tex.blob != null){ URL.revokeObjectURL(tex.blobURL); }

			// Reset context contents
			return emptyOutput;
		});
	}, []);

	const updateTEX = useCallback((value) => {
		setOutput(prevState => {
			if(prevState.tex.content != value){
				if(prevState.tex.blob != null){ URL.revokeObjectURL(prevState.tex.blobURL); }
				const blob = new Blob([value], { type: "text/plain" });
				
				return {
					...prevState,
					tex: {
						content: value,
						blob,
						blobURL: URL.createObjectURL(blob)
					}
				};

			} else {
				return prevState;
			}
		});
	}, []);

	const addBibliography = useCallback((bibliography) => {
		setOutput(prevState => {
			if(prevState.bib.blob != null){ URL.revokeObjectURL(prevState.bib.blobURL); }
			const blob = new Blob([bibliography], { type: "text/plain" });
			return {
				...prevState,
				bib: {
					content: bibliography,
					blob,
					blobURL: URL.createObjectURL(blob)
				}
			};
		});
	}, []);

	const addFigure = useCallback(async(url, fileExt) => {
		let figCount = -1;

		try {
			const figFile = await fetch(url, { method: "GET" });
			const figBlob = await figFile.blob();

			setOutput(prevState => {
				const { list } = prevState.figs;
				figCount = list.length + 1;
				const thisFig = {
					input: figBlob,
					name: `figure-${figCount}.${fileExt}`
				};
    
				return {
					...prevState,
					figs: {
						...prevState.figs,
						list: [...list, thisFig]
					}
				};
			});

		} catch(e){
			console.error("Failed retrieval of figure at the following URL : %d", url);
		}

		return figCount;

	}, []);

	const zipFigures = useCallback(async() => {
		const { list } = output.figs;
		if(list.length > 0){
			const blob = await downloadZip(list).blob();
			setOutput(prevState => {
				if(prevState.figs.blob != null){ URL.revokeObjectURL(prevState.figs.blobURL); }
				return {
					...prevState,
					figs: {
						...prevState.figs,
						blob,
						blobURL: URL.createObjectURL(blob)
					}
				};
			});
		}
	}, [output.figs]);

	const zipPackage = useCallback(async(title) => {
		const { bib, figs, tex } = output;
		const packageFiles = [
			...figs.list,
			{ name: `${title}.tex`, input: tex.content }
		];
		if(bib.blob != null){ packageFiles.push({ name: "bibliography.bib", input: bib.blob }); }

		const blob = await downloadZip(packageFiles).blob();

		setOutput(prevState => {
			if(prevState.full_package.blob != null){ URL.revokeObjectURL(prevState.full_package.blobURL); }
			return {
				...prevState,
				full_package: {
					...prevState.full_package,
					blob,
					blobURL: URL.createObjectURL(blob)
				}
			};
		});

	}, [output]);

	const contextValue = useMemo(() => ({
		output, 
		handlers: {
			addBibliography,
			addFigure,
			resetOutput,
			updateTEX,
			zipFigures,
			zipPackage
		}
	}), [addBibliography, addFigure, output, resetOutput, updateTEX, zipFigures, zipPackage]);

	return (
		<ExportContext.Provider value={contextValue}>
			{children}
		</ExportContext.Provider>
	);
};
ExportContextProvider.propTypes = {
	children: node
};

const useExportContext = () => {
	const context = useContext(ExportContext);

	return context;
};

export { ExportContextProvider, useExportContext };
