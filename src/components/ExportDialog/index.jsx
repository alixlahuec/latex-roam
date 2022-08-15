import { arrayOf, bool, func, instanceOf, shape, string } from "prop-types";
import { useCallback, useEffect, useMemo } from "react";

import { AnchorButton, Button, ButtonGroup, Classes, ControlGroup, Dialog, FormGroup, Icon, InputGroup, MenuItem, Spinner, Switch, TextArea } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import useBool from "../../hooks/useBool";
import useExport from "../../hooks/useExport";
import useSelect from "../../hooks/useSelect";
import useText from "../../hooks/useText";

import { CustomClasses } from "../../constants";

import "./index.css";


const popoverProps = {
	canEscapeKeyClose: false,
	minimal: true,
	popoverClassName: CustomClasses.POPOVER_CLASS
};

const DOC_CLASS_OPTIONS = [
	{ value: "article", label: "Article" },
	{ value: "book", label: "Book" },
	{ value: "report", label: "Report" }
];

function renderAsMenuItem(item, itemProps) {
	const { handleClick, modifiers: { active } } = itemProps;

	return <MenuItem active={active} key={item.value} onClick={handleClick} text={item.label} />;
}

function SingleSelect({ menuTitle, onChange, options, value }){
    
	const menuProps = useMemo(() => ({
		title: menuTitle
	}), [menuTitle]);

	const popoverTargetProps = useMemo(() => ({
		style: { textAlign: "right" },
		title: menuTitle
	}), [menuTitle]);

	const selectValue = useCallback((item) => {
		onChange(item.value);
	}, [onChange]);

	return (
		<Select 
			filterable={false}
			itemRenderer={renderAsMenuItem}
			itemsEqual="value"
			items={options}
			menuProps={menuProps}
			onItemSelect={selectValue}
			placement="bottom"
			popoverProps={popoverProps}
			popoverTargetProps={popoverTargetProps} >
			<Button minimal={true} rightIcon="caret-down" text={options.find(op => op.value == value).label} />
		</Select>
	);
}
SingleSelect.propTypes = {
	menuTitle: string,
	onChange: func,
	options: arrayOf(shape({ label: string, value: string })),
	value: string
};

function DownloadButton({ entity, fileName, icon = null, text, ...buttonProps }){
	return entity.blobURL
		? <AnchorButton download={fileName} href={entity.blobURL} icon={icon} text={text} {...buttonProps} />
		: null;
}
DownloadButton.propTypes = {
	entity: shape({
		blob: instanceOf(Blob),
		blobURL: string
	}),
	fileName: string,
	icon: string,
	text: string
};

function Output({ isLoading, output, title }){

	return output.tex.content.length > 0
		? <form
			action="https://www.overleaf.com/docs"
			className={Classes.FILL} 
			id="latex-roam-export-form"
			method="POST"
			target="_blank" >
			<TextArea aria-label="Generated LaTeX output" id="latex-roam-export-contents" fill={true} growVertically={false} name="snip" readOnly={true} small={true} value={output.tex.content} />
			<ButtonGroup className="rl-tex-buttons--top" minimal={true} >
				<DownloadButton entity={output.tex} fileName={title + ".tex"} icon="download" minimal={true} text=".TEX" title="Download .tex file" />
				<Button icon="share" minimal={true} text="Open in Overleaf" title="Open LaTeX document in Overleaf" type="submit" />
			</ButtonGroup>
			<ButtonGroup className="rl-tex-buttons--bottom" minimal={true} >
				<DownloadButton entity={output.bib} fileName="bibliography.bib" icon="manual" intent="primary" text=".BIB" title="Download bibliography" />
				<DownloadButton entity={output.figs} fileName="figures.zip" icon="media" intent="primary" text={"Figures (" + output.figs.list.length + ")"} title="Download figures" />
				<DownloadButton entity={output.package} fileName={title + ".zip"} icon="download" intent="success" text="Download all" title="Download all files" />
			</ButtonGroup>
		</form>
		: isLoading 
			? <Spinner size={16} />
			: null;
}
Output.propTypes = {
	isLoading: bool,
	output: shape({
		bib: shape({
			content: string,
			blob: instanceOf(Blob),
			blobURL: string
		}),
		figs: shape({
			list: arrayOf(shape({ input: instanceOf(Blob), name: string })),
			blob: instanceOf(Blob),
			blobURL: string
		}),
		tex: shape({
			content: string,
			blob: instanceOf(Blob),
			blobURL: string
		}),
		package: shape({
			blob: instanceOf(Blob),
			blobURL: string
		}),
	}),
	title: string
};

function ExportDialog({ isOpen, onClose, uid }){
	const [output, { isLoading, resetOutput, triggerExport }] = useExport({ uid });
	const [document_class, setDocumentClass] = useSelect({
		start: "report"
	});
	const [authors, setAuthors] = useText("");
	const [title, setTitle] = useText("");
	const [cover, { toggle: toggleCover }] = useBool(true);
	const [numberedHeaders, { toggle: toggleNumberedHeaders }] = useBool(true);

	const onOpening = useCallback(() => setTitle({ target: { value: document.title } }), [setTitle]);

	const handleClose = useCallback(() => {
		window.latexRoam.resetExport();
		resetOutput();
		onClose();
	}, [onClose, resetOutput]);

	const exportConfig = useMemo(() => ({
		authors,
		cover,
		document_class,
		numbered: numberedHeaders,
		start_header: 1,
		title
	}), [authors, cover, document_class, numberedHeaders, title]);

	const startExport = useCallback(async() => await triggerExport(exportConfig), [exportConfig, triggerExport]);

	/* istanbul ignore next */
	useEffect(() => {
		return () => {
			window.latexRoam.resetExport();
		};
	}, []);

	return <Dialog 
		className={CustomClasses.DIALOG_CLASS}
		isOpen={isOpen} 
		onClose={handleClose} 
		onOpening={onOpening} >
		<div className={Classes.DIALOG_HEADER}>
			<div>
				<Icon icon="cargo-ship" />
				<span>Export to LaTeX</span>
			</div>
			<Button icon="small-cross" minimal={true} onClick={handleClose} title="Close dialog" />
		</div>
		<div className={Classes.DIALOG_BODY}>
			<div id="latex-roam-export-div">
				<ControlGroup className="rl--settings-col" vertical={true}>
					<FormGroup label="Title" labelFor="doc-title">
						<InputGroup
							autoComplete="off"
							id="doc-title"
							onChange={setTitle}
							spellCheck="false"
							type="text"
							value={title}
						/>
					</FormGroup>
					<FormGroup label="Author(s)" labelFor="doc-authors">
						<InputGroup
							autoComplete="off"
							id="doc-authors"
							onChange={setAuthors}
							spellCheck="false"
							type="text"
							value={authors}
						/>
					</FormGroup>
				</ControlGroup>
				<ControlGroup className="rl--settings-col" vertical={true}>
					<FormGroup inline={true} label="Document class">
						<SingleSelect menuTitle="Select a LaTeX document class" onChange={setDocumentClass} options={DOC_CLASS_OPTIONS} value={document_class} />
					</FormGroup>
					<FormGroup inline={true} label="Use cover" labelFor="doc-cover">
						<Switch checked={cover} id="doc-cover" onChange={toggleCover} />
					</FormGroup>
					<FormGroup inline={true} label="Use numbered headers" labelFor="doc-headers-nb">
						<Switch checked={numberedHeaders} id="doc-headers-nb" onChange={toggleNumberedHeaders} />
					</FormGroup>
				</ControlGroup>
				<Button id="latex-roam-export-trigger" intent="primary" loading={isLoading} onClick={startExport} rightIcon="repeat" text="Generate LaTeX" title="Export contents as LaTeX" />
			</div>
			<Output isLoading={isLoading} output={output} title={title} />
		</div>
	</Dialog>;
}
ExportDialog.propTypes = {
	isOpen: bool,
	onClose: func,
	uid: string
};

export default ExportDialog;
