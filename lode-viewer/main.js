import Core from "../basic-tools/tools/core.js";
import Net from "../basic-tools/tools/net.js";
import Dom from "../basic-tools/tools/dom.js";

import Configuration from "./configuration.js";
import Application from "./application.js";

Core.root = "./";

Net.JSON(`${Core.root}config/config.nls.json`).then(value => {
	Core.locale = document.documentElement.lang || "en";
	Core.nls = value.result;
	
	var p1 = Net.JSON(`${Core.root}config/config.applications.json`);
	
	Promise.all([p1]).then(Start);
});

function Start(results) {		
	var defs = results[0].result.map(m => Net.JSON(`${Core.root}${m}`));
	
	var config = {}
	
	var p1 = Promise.all(defs).then(values => {
		config.maps = {};
		
		// Store map configurations in config object
		values.forEach(v => config.maps[v.result.id] = Configuration.FromJSON(v.result));
	});
	
	var p2 = Net.JSON(`${Core.root}config/config.bookmarks.json`).then(value => {
		// Store bookmarks for CMA extents from bookmarks config file
		config.bookmarks = value.result.items;
	});
	
	var p3 = Net.JSON(`${Core.root}config/config.search.json`).then(value => {
		// Store search CSD values from search config file
		config.search = value.result;
	});
		
	Promise.all([p1, p2, p3]).then(results => {
		// Update app-container with application
		var node = Dom.Node(document.body, "#app-container");
		var app = new Application(node, config);
	});
}

