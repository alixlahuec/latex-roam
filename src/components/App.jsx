/* istanbul ignore file */
import { shape, string } from "prop-types";
import { Component } from "react";

import ExportDialog from "./ExportDialog";
import GraphWatcher from "./GraphWatcher";


import { addBlockMenuCommand } from "Roam";

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			dialogIsOpen: false,
			exportUID: null
		};
		this.closeDialog = this.closeDialog.bind(this);
		this.openDialog = this.openDialog.bind(this);
	}

	componentDidMount(){
		addBlockMenuCommand("Export to LaTeX", (entity) => {
			this.openDialog(entity["block-uid"]);
		});
	}

	render(){

		const { dialogIsOpen, exportUID } = this.state;

		return (
			<>
				<GraphWatcher />
				<ExportDialog isOpen={dialogIsOpen} onClose={this.closeDialog} uid={exportUID} />
			</>
		);
	}

	closeDialog(){
		this.setState((_prev) => ({ dialogIsOpen: false, exportUID: null }));
	}

	openDialog(uid){
		if(uid){
			this.setState((_prev) => ({ dialogIsOpen: true, exportUID: uid }));
		}
	}
}
App.propTypes = {
	extension: shape({
		version: string
	})
};

export default App;
