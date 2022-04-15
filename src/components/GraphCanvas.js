import {useEffect, useState} from "react";

import MultiDirectedGraph from "graphology";
import cytoscape from "cytoscape/dist/cytoscape.esm";

export default function GraphCanvas(props) {
	return (
		<div>
			<h1>Here will be an awesome canvas</h1>
			<p>{(!process.env.REACT_APP_API_URL) ? `Please refer the endpoint's urt via the environnement variable REACT_APP_API_URL`: process.env.REACT_APP_API_URL}</p>
		</div>
	)
}