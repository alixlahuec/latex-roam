import React, { Component } from "react";
import { shape, string } from "prop-types";
import { ExportContextProvider } from "./ExportContext";
import GraphWatcher from "./GraphWatcher";

class App extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<ExportContextProvider>
				<GraphWatcher />
			</ExportContextProvider>
		);
	}
}
App.propTypes = {
	extension: shape({
		version: string
	})
};

export default App;
