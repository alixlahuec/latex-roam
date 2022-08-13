import { string } from "prop-types";

import { Button } from "@blueprintjs/core";
import ExportDialog from "../ExportDialog";

import useBool from "../../hooks/useBool";

import { CustomClasses } from "../../constants";


function ExportButton({ uid }){
	const [isDialogOpen, { on: openDialog, off: closeDialog }] = useBool(false);

	return <>
		<Button className={CustomClasses.BUTTON_CLASS} icon="rect-width" minimal={true} onClick={openDialog} text="LaTeX" />
		<ExportDialog isOpen={isDialogOpen} onClose={closeDialog} uid={uid} />
	</>;
}
ExportButton.propTypes = {
	uid: string
};

export default ExportButton;