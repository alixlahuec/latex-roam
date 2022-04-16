import React, { useCallback, useState } from "react";
import { string } from "prop-types";
import { Button } from "@blueprintjs/core";
import ExportDialog from "./ExportDialog";

import { buttonClass } from "../classes";

function ExportButton({ uid }){
	const [isDialogOpen, setDialogOpen] = useState(false);

	const openDialog = useCallback(() => setDialogOpen(true), []);
	const closeDialog = useCallback(() => setDialogOpen(false), []);

	return <>
		<Button className={buttonClass} icon="rect-width" minimal={true} onClick={openDialog} text="LaTeX" />
		<ExportDialog isOpen={isDialogOpen} onClose={closeDialog} uid={uid} />
	</>;
}
ExportButton.propTypes = {
	uid: string
};

export default ExportButton;