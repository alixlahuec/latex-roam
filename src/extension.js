import { downloadZip } from "client-zip";

import _createTEX from "./translator/createTEX";


export const DEFAULT_OUTPUT = {
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
	tex: {
		content: "",
		blob: null,
		blobURL: null
	},
	package: {
		blob: null,
		blobURL: null
	}
};


export class ExportManager {
	constructor(){
		this.bib = DEFAULT_OUTPUT.bib;
		this.figs = DEFAULT_OUTPUT.figs;
		this.tex = DEFAULT_OUTPUT.tex;
		this.package = DEFAULT_OUTPUT.package;
	}

	#resetBlobBib(){
		if(this.bib.blob != null){ 
			URL.revokeObjectURL(this.bib.blobURL);
			this.bib.blob = null;
		}
	}

	#resetBlobFigs(){
		if(this.figs.blob != null){ 
			URL.revokeObjectURL(this.figs.blobURL);
			this.figs.blob = null;
		}
	}

	#resetBlobTEX(){
		if(this.tex.blob != null){ 
			URL.revokeObjectURL(this.tex.blobURL);
			this.tex.blob = null;
		}
	}

	#resetBlobPackage(){
		if(this.package.blob != null){
			URL.revokeObjectURL(this.package.blobURL);
			this.package.blob = null;
		}
	}

	resetExport(){
		// Clean up artefacts
		this.#resetBlobBib();
		this.#resetBlobFigs();
		this.#resetBlobTEX();
		this.#resetBlobPackage();

		this.bib = DEFAULT_OUTPUT.bib;
		this.figs = DEFAULT_OUTPUT.figs;
		this.tex = DEFAULT_OUTPUT.tex;
		this.package = DEFAULT_OUTPUT.package;
	}

	#updateTEX(tex){
		if(tex != this.tex.content){
			this.#resetBlobTEX();
			this.tex = DEFAULT_OUTPUT.tex;

			const blob = new Blob([tex], { type: "text/plain" });

			this.tex ={
				content: tex,
				blob,
				blobURL: URL.createObjectURL(blob)
			};
		}
	}

	addBibliography(bibliography){
		this.#resetBlobBib();
		this.bib = DEFAULT_OUTPUT.bib;

		const blob = new Blob([bibliography], { type: "text/plain" });
        
		this.bib = {
			content: bibliography,
			blob,
			blobURL: URL.createObjectURL(blob)
		};
	}

	async addFigure(url, fileExt){
		let figCount = -1;

		const figFile = await fetch(url, { method: "GET" });
		const figBlob = await figFile.blob();
		figCount = this.figs.list.length + 1;

		this.figs.list.push({
			input: figBlob,
			name: `figure-${figCount}.${fileExt}`
		});

		return figCount;
	}

	async #zipFigures(){
		if(this.figs.list.length > 0){
			const blob = await downloadZip(this.figs.list).blob();
			this.#resetBlobFigs();

			this.figs.blob = blob;
			this.figs.blobURL = URL.createObjectURL(blob);
		}
	}

	async #zipPackage(title){
		const packageFiles = [
			...this.figs.list,
			{ name: `${title}.tex`, input: this.tex.content }
		];
		if(this.bib.blob != null){ packageFiles.push({ name: "bibliography.bib", input: this.bib.blob }); }

		const blob = await downloadZip(packageFiles).blob();
		this.#resetBlobPackage();

		this.package.blob = blob;
		this.package.blobURL = URL.createObjectURL(blob);
	}

	async #createTEX(uid, config){
		const { document_class, ...rest } = config;
		return await _createTEX(uid, document_class, { ...rest });
	}

	async generateExport(uid, config){
		this.resetExport();
    
		// Processing of page contents
		const texOutput = await this.#createTEX(uid, config);

		this.#updateTEX(texOutput);
		// Prepare .zip of figures for download
		await this.#zipFigures();
		// Prepare .zip of full package for download
		await this.#zipPackage(config.title);

		return {
			bib: this.bib,
			figs: this.figs,
			tex: this.tex,
			package: this.package
		};
	}
}
