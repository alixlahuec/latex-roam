import JSZip from "jszip/dist/jszip";

import { _createTEX } from "./translator/createTEX";


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
	},
	logger: {
		errors: [],
		warnings: []
	}
};


export class ExportManager {
	#jszipFigures;
	#jszipPackage;

	constructor(){
		this.bib = { ...DEFAULT_OUTPUT.bib };
		this.figs = { ...DEFAULT_OUTPUT.figs };
		this.tex = { ...DEFAULT_OUTPUT.tex };
		this.package = { ...DEFAULT_OUTPUT.package };
		this.logger = {
			errors: [],
			warnings: []
		};
        
		this.#jszipFigures = new JSZip();
		this.#jszipPackage = new JSZip();
	}

	error(e){
		this.logger.errors.push(e);
	}

	warn(e){
		this.logger.warnings.push(e);
	}

	#resetBlobBib(){
		if(this.bib.blob != null){ 
			URL.revokeObjectURL(this.bib.blobURL);
			this.bib.blob = null;
			this.bib.blobURL = null;
		}
	}

	#resetBlobFigs(){
		if(this.figs.blob != null){ 
			URL.revokeObjectURL(this.figs.blobURL);
			this.figs.blob = null;
			this.figs.blobURL = null;
		}
	}

	#resetBlobTEX(){
		if(this.tex.blob != null){ 
			URL.revokeObjectURL(this.tex.blobURL);
			this.tex.blob = null;
			this.tex.blobURL = null;
		}
	}

	#resetBlobPackage(){
		if(this.package.blob != null){
			URL.revokeObjectURL(this.package.blobURL);
			this.package.blob = null;
			this.package.blobURL = null;
		}
	}

	#resetToDefault(){
		this.bib = { ...DEFAULT_OUTPUT.bib };
		this.figs = { 
			...DEFAULT_OUTPUT.figs,
			list: []
		};
		this.tex = { ...DEFAULT_OUTPUT.tex };
		this.package = { ...DEFAULT_OUTPUT.package };
		this.logger = {
			errors: [],
			warnings: []
		};

		this.#jszipFigures = new JSZip();
		this.#jszipPackage = new JSZip();
	}

	resetExport(){
		// Clean up artefacts
		this.#resetBlobBib();
		this.#resetBlobFigs();
		this.#resetBlobTEX();
		this.#resetBlobPackage();

		this.#resetToDefault();
	}

	#updateTEX(tex){
		if(tex != this.tex.content){
			this.#resetBlobTEX();
			this.tex = { ...DEFAULT_OUTPUT.tex };

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
		this.bib = { ...DEFAULT_OUTPUT.bib };

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
			this.figs.list.forEach((entry) => {
				this.#jszipFigures.file(entry.name, entry.input);
			});

			const blob = await this.#jszipFigures.generateAsync({ type: "blob" });
			this.#resetBlobFigs();

			this.figs.blob = blob;
			this.figs.blobURL = URL.createObjectURL(blob);
		}
	}

	async #zipPackage(title){
		this.#jszipPackage.file(`${title}.tex`, this.tex.content);
		
		if(this.bib.blob != null){ this.#jszipPackage.file("bibliography.bib", this.bib.blob); }

		if(this.figs.list.length > 0){
			this.figs.list.forEach((entry) => {
				this.#jszipPackage.file(entry.name, entry.input);
			});
		}

		const blob = await this.#jszipPackage.generateAsync({ type: "blob" });
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
