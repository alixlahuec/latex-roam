import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bool, func, string } from "prop-types";

import { AnchorButton, Button, Classes, Dialog, InputGroup, Label, MenuItem, Switch, TextArea } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import { useExportContext } from "./ExportContext";
import startExport from "../export";

import { CustomClasses } from "../constants";


const popoverProps = {
	minimal: true,
	popoverClassName: CustomClasses.POPOVER_CLASS
};

const documentClasses = {
	"article": "Article",
	"book": "Book",
	"report": "Report"
};

const headers = {
	"1": "Start with header 1",
	"2": "Start with header 2",
	"3": "Start with header 3",
	"4": "Start with header 4"
};

function itemRenderer(item, itemProps) {
	const { handleClick, modifiers: { active } } = itemProps;

	return <MenuItem active={active} key={item} onClick={handleClick} text={item} />;
}

function ExportDialog({ isOpen, onClose, uid }){
	const { output, resetOutput, updateTEX, addBibliography, addFigure, zipFigures, zipPackage } = useExportContext();
	const outputArea = useRef();
	const [documentClass, setDocumentClass] = useState("report");
	const [authors, setAuthors] = useState("");
	const [title, setTitle] = useState("");
	const [useCover, setUseCover] = useState(true);
	const [useNumberedHeaders, setNumberedHeaders] = useState(true);
	const [startWithHeader, setStartWithHeader] = useState("1");

	const handleAuthorsChange = useCallback((event) => {
		let value = event.target?.value;
		setAuthors(value || "");
	}, []);

	const handleTitleChange = useCallback((event) => {
		let value = event.target?.value;
		setTitle(value || "");
	}, []);

	const toggleCover = useCallback(() => setUseCover(prev => !prev), []);
	const toggleNumberedHeaders = useCallback(() => setNumberedHeaders(prev => !prev), []);

	const handleStartHeaderChange = useCallback((event) => {
		let value = event.target?.value;
		setStartWithHeader(value || "1");
	}, []);

	const handleOutputChange = useCallback((event) => {
		let value = event.target?.value;
		updateTEX(value || "");
	}, [updateTEX]);

	const outputHandlers = useMemo(() => {
		return {
			addBibliography,
			addFigure,
			resetOutput,
			updateTEX,
			zipFigures,
			zipPackage
		};
	}, [addBibliography, addFigure, resetOutput, updateTEX, zipFigures, zipPackage]);

	const triggerExport = useCallback(() => {
		startExport(uid, { authors, document_class: documentClass, headersNumbered: useNumberedHeaders, startWithHeader, title, useCover }, outputHandlers);
	}, [uid, authors, documentClass, useNumberedHeaders, startWithHeader, title, useCover, outputHandlers]);

	useEffect(() => {
		if(isOpen){
			setTitle(document.title);
		} else {
			resetOutput();
		}
	}, [isOpen, resetOutput]);

	return <Dialog 
		className={CustomClasses.DIALOG_CLASS} 
		isCloseButtonShown={true}
		isOpen={isOpen} 
		onClose={onClose} 
		title="Export to LaTeX" >
		<div className={Classes.DIALOG_BODY}>
			<div id="latex-roam-export-div">
				<div className="latex-roam--settings-row">
					<Label>Document class :</Label>
					<Select 
						filterable={false}
						itemRenderer={itemRenderer}
						items={Object.keys(documentClasses)}
						onItemSelect={setDocumentClass}
						placement="bottom"
						popoverProps={popoverProps}>
						<Button minimal={true} rightIcon="double-caret-vertical" text={documentClasses[documentClass]} />
					</Select>
					<Switch checked={useCover} label="Use cover title" onChange={toggleCover} />
				</div>
				<div className="latex-roam--settings-row">
					<Label>Author(s) :</Label>
					<InputGroup
						autoComplete="off"
						onChange={handleAuthorsChange}
						spellCheck="false"
						type="text"
						value={authors}
					/>
					<Label>Title :</Label>
					<InputGroup
						autoComplete="off"
						onChange={handleTitleChange}
						spellCheck="false"
						type="text"
						value={title}
					/>
				</div>
				<div className="latex-roam--settings-row">
					<Label>Headers :</Label>
					<Select
						filterable={false}
						itemRenderer={itemRenderer}
						items={Object.keys(headers)}
						onItemSelect={handleStartHeaderChange}
						placement="bottom"
						popoverProps={popoverProps} >
						<Button minimal={true} rightIcon="double-caret-vertical" text={headers[startWithHeader]} />
					</Select>
					<Switch checked={useNumberedHeaders} label="Use numbers" onChange={toggleNumberedHeaders} />
				</div>
				<Button id="latex-roam-export-trigger" intent="success" onClick={triggerExport} text="Export page contents" />
			</div>
			{output.tex.content != ""
				? <form
					action="https://www.overleaf.com/docs"
					className={Classes.FILL} 
					id="latex-roam-export-form"
					method="POST"
					target="_blank" >
					<TextArea id="latex-roam-export-contents" fill={true} growVertically={false} inputRef={outputArea} name="snip" onChange={handleOutputChange} readOnly={true} small={true} style={{ height: "200px" }} value={output.tex.content} />
					<Button id="latex-roam--overleaf-trigger" intent="success" text="Export to Overleaf" type="submit" />
				</form>
				: null}
		</div>
		<div className={Classes.DIALOG_FOOTER}>
			<div className={Classes.DIALOG_FOOTER_ACTIONS}>
				{output.bib.blobURL
					? <AnchorButton download="bibliography.bib" href={output.bib.blobURL} outlined={true} text="Download bibliography" />
					: null}
				{output.figs.blobURL
					? <AnchorButton download="figures.zip" href={output.figs.blobURL} outlined={true} text={"Download figures (" + output.figs.list.length + ")"} />
					: null}
				{output.tex.blobURL
					? <AnchorButton download={title + ".tex"} href={output.tex.blobURL} outlined={true} text="Download .tex file" />
					: null}
				{output.full_package.blobURL
					? <AnchorButton download={title + ".zip"} href={output.full_package.blobURL} intent="primary" outlined={true} text="Download all files" />
					: null}
			</div>
		</div>
	</Dialog>;
}
ExportDialog.propTypes = {
	isOpen: bool,
	onClose: func,
	uid: string
};

export default ExportDialog;
