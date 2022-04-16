import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bool, func, string } from "prop-types";
import { AnchorButton, Button, Classes, Dialog, InputGroup, MenuItem, Switch, Tag, TextArea } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import { useExportContext } from "./ExportContext";
import startExport from "../export";
import { dialogClass, popoverClass } from "../classes";

const popoverProps = {
	minimal: true,
	popoverClassName: popoverClass
};

const documentClasses = {
	"article": "Article",
	"book": "Book",
	"report": "Report"
};

const headers = {
	"1": "Level 1",
	"2": "Level 2",
	"3": "Level 3",
	"4": "Level 4"
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
		className={dialogClass} 
		isCloseButtonShown={true}
		isOpen={isOpen} 
		onClose={onClose} 
		title="Export to LaTeX" >
		<div className={Classes.DIALOG_BODY}>
			<div id="roam-to-latex-export-div">
				<div id="roam-to-latex-export-settings">
					<Select 
						filterable={false}
						itemRenderer={itemRenderer}
						onItemSelect={setDocumentClass}
						options={Object.keys(documentClasses)}
						placement="bottom"
						popoverProps={popoverProps}>
						<Button minimal={true} text={documentClasses[documentClass]} />
					</Select>
					<InputGroup
						autoComplete="off"
						leftElement={<Tag minimal={true}>Written by</Tag>}
						onChange={handleAuthorsChange}
						placeholder="Author(s)"
						spellCheck="false"
						type="text"
						value={authors}
					/>
					<InputGroup
						autoComplete="off"
						leftElement={<Tag minimal={true}>Title</Tag>}
						onChange={handleTitleChange}
						placeholder="Document Title"
						spellCheck="false"
						type="text"
						value={title}
					/>
					<Switch checked={useCover} label="Use cover title" onChange={toggleCover} />
					<Switch checked={useNumberedHeaders} label="Numbered headers" onChange={toggleNumberedHeaders} />
					<Select
						filterable={false}
						itemRenderer={itemRenderer}
						onItemSelect={handleStartHeaderChange}
						options={Object.keys(headers)}
						placement="bottom"
						popoverProps={popoverProps} >
						<Button minimal={true} text={headers[startWithHeader]} />
					</Select>
					<Button id="roam-to-latex-export-trigger" intent="success" onClick={triggerExport} outlined={true} text="Export page contents" />
				</div>
				<form
					action="https://www.overleaf.com/docs"
					className={Classes.FILL} 
					id="roam-to-latex-export-form"
					method="POST"
					style={{ display: "none" }}
					target="_blank" >
					<TextArea id="roam-to-latex-export-contents" fill={true} growVertically={false} inputRef={outputArea} name="snip" onChange={handleOutputChange} readOnly={true} small={true} style={{ height: "200px" }} value={output.tex.content} />
					<Button disabled={output.tex.content != ""} text="Export to Overleaf" type="submit" />
				</form>
			</div>
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
					? <AnchorButton download={title + ".zip"} href={output.full_package.blobURL} />
					: null}
				<Button className="roam-to-latex-export-package" disabled={true} intent="primary" outlined={true} text="Download all files" />
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
