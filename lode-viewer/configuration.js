import Core from '../basic-tools/tools/core.js';

/**
 * Configuration class for processing the configuration file.
 * @class
 */
export default class Configuration {
	/** 
	 * Get the id from the map config file. Get for untransformed properties
	 * @returns - the id of the map config file.
	 */
	get ID() {
		return this.id;
	}
	
	/**
	 * Get the data sources defined in the map configuration file.  
	 * @returns - an object containing data sources 
	 */
	get DataSources() {
		return this.dataSources;
	}

	/**
	 * Get the style from the map config file.
	 * @returns - the map style defined in the map config file. 
	 */
	get Style() {
		return this.style;
	}
	
	/**
	 * Get the localized strings for the map abbreviation
	 * @retruns - An object containing the English and French map abbreviations
	 */
	get Abbr() {
		return this.abbr;
	}
	
	/**
	 * Get the localized strings for the map title.
	 * @returns - An object containing the English and French map titles.
	 */
	get Title() {
		return this.title;
	}
	
	/**
	 * Get the localized string of the full title for the map
	 * @returns - A string of the full title.
	 */
	get FullTitle() {
		return `${this.Title} (${this.Abbr})`;
	}
	
	/**
	 * Get for localized string of the URL for the table configuration file
	 * @returns - A string representing the URL of the table configuration file
	 */ 
	get TableUrl() {
		return this.tableUrl;
	}
	
	get Table() {
		if (!this.table) return null;
		
		return {
			path : this.table.path,
			summary : this.table.summary,
			title : this.table.title,
			description : this.table.description,
			fields : this.Fields
		}
	}
	
	/**
	 * The map description defined in the configuration file.
	 * @returns - A sentence describing the map
	 */
	get Description() {
		return this.description;
	}
	
	/**
	 * Get a list of layers defined in the map config file
	 * @returns - list of layers
	 */
	get Layers() {
		return this.layers;
	}
	
	/**
	 * Get a list of all layer ids. Get for transformed properties.
	 * @returns - list of layer ids
	 */
	get LayerIDs() {
		var layers = this.Layers;
		
		return layers && layers.map(l => l.id);
	}
	
	/**
	 * Get a list of visible layers
	 * @returns - Filtered list of layers where layer.visible != false
	 */
	get VisibleLayers() {
		var layers = this.Layers;
		
		return layers && layers.filter(l => (l.visible || l.visible === undefined));
	}
	
	/**
	 * Get a list of layer ids for visible layers
	 * @returns - List of visible layer ids
	 */
	get VisibleLayerIDs() {	
		var layers = this.VisibleLayers;
		
		return layers && layers.map(l => l.id);
	}
	
	/**
	 * Get a list of layers currently selected
	 * @returns - Filtered list of layers currently selected.
	 */
	get SelectedLayers() {
		var layers = this.Layers;
		
		return layers.filter(l => l.selected);
	}
	
	/**
	 * Get a list of layer ids for selected layers
	 * @returns - List of selected layers ids.
	 */
	get SelectedLayerIDs()  {
		var layers = this.SelectedLayers;
		
		return layers && layers.map(l => l.id);
	}
	
	/**
	 * Get a list of layers that are clickable
	 * @returns - Filtered list of clickable layers.
	 */
	get ClickableLayers() {
		var layers = this.Layers;
		
		return layers && layers.filter(l => !!l.click);
	}
	
	/**
	 * Get a list of layer ids for clickable layers.
	 * @returns - List of clickable layers ids.
	 */
	get ClickableLayersIDs() {	
		var layers = this.ClickableLayers;
		
		return layers && layers.map(l => l.id);
	}
	
	/**
	 * Get legend defined in the map config
	 * @returns - list of legend item objects.
	 */
	get Legend() {		
		return this.legend && this.legend.map(l => { 
			return { 
				color : l.color, 
				label : l.label && l.label[Core.locale], 
				title : Core.Nls("Legend_Checkbox_Title"),
				value : l.value 
			} 
		});
	}
	
	/**
	 * Get the list of fields in the table from the table configuration file.
	 * @returns - A list of fields in the table
	 */
	get Fields() {
		if (!this.table) return null;
		
		return this.table.fields.map(f => { 
			return { 
				id : f.id,
				label : f[Core.locale],
				type : f.type || null
			} 
		});
	}
	
	constructor() {
		this.id = null;
		this.dataSources = null;
		this.style = null;
		this.tableUrl = null;
		this.layers = null;
		this.title = null;
		this.abbr = null;
		this.description = null;
		this.legend = null;
		this.table = null;
	}
	
	UpdateTable(json) {
		this.table = {
			path : json.path,
			summary : json.summary,
			title : json.title[Core.locale],
			description : json.description[Core.locale],
			fields : json.fields
		}
	}
	
	/**
	 * Check if the specified layerId is in the map layers list.
	 * @param {string} layerId - The layer id
	 * @returns - true/false if map has the specified layer.
	 */
	HasLayer(layerId) {
		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].id === layerId) return true;
		}
		
		return false;
	}
	
	/**
	 * Parse a json object and extract specific properties
	 * @param {object} json - map object content
	 * @returns - the extracted object content
	 */
	static FromJSON(json) {
		var c = new Configuration();
		
		c.id = json.id;
		c.dataSources = json.dataSources;
		c.style = json.style;
		c.tableUrl = json.table || null;
		c.layers = json.layers || null;
		c.title = json.title && json.title[Core.locale] || null;
		c.abbr = json.abbr && json.abbr[Core.locale] || null;
		c.description = json.description && json.description[Core.locale] || null;
		c.legend = json.legend || null;

		return c;
	}
}