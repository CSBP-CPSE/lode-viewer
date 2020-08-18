import Core from '../basic-tools/tools/core.js';

export default class Configuration {
	
	// Get for untransformed properties
	get ID() {
		return this.id;
	}
	
	get Style() {
		return this.style;
	}
	
	// Get for localized strings
	get Abbr() {
		return this.abbr;
	}
	
	// Get for localized strings
	get Title() {
		return this.title;
	}
	
	// Get for localized strings
	get FullTitle() {
		return `${this.Title} (${this.Abbr})`;
	}
	
	// Get for localized strings
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
	
	get Description() {
		return this.description;
	}
	
	get Layers() {
		return this.layers;
	}
	
	// Get for transformed properties
	get LayerIDs() {
		var layers = this.Layers;
		
		return layers && layers.map(l => l.id);
	}
	
	get VisibleLayers() {
		var layers = this.Layers;
		
		return layers && layers.filter(l => (l.visible || l.visible === undefined));
	}
	
	get VisibleLayerIDs() {	
		var layers = this.VisibleLayers;
		
		return layers && layers.map(l => l.id);
	}
	
	get SelectedLayers() {
		var layers = this.Layers;
		
		return layers.filter(l => l.selected);
	}
	
	get SelectedLayerIDs()  {
		var layers = this.SelectedLayers;
		
		return layers && layers.map(l => l.id);
	}
	
	get ClickableLayers() {
		var layers = this.Layers;
		
		return layers && layers.filter(l => !!l.click);
	}
	
	get ClickableLayersIDs() {	
		var layers = this.ClickableLayers;
		
		return layers && layers.map(l => l.id);
	}
	
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
	
	UpdateTable(json) {
		this.table = {
			path : json.path,
			summary : json.summary,
			title : json.title[Core.locale],
			description : json.description[Core.locale],
			fields : json.fields
		}
	}
	
	constructor() {
		this.id = null;
		this.style = null;
		this.tableUrl = null;
		this.layers = null;
		this.title = null;
		this.abbr = null;
		this.description = null;
		this.legend = null;
		this.table = null;
	}
	
	HasLayer(layerId) {
		for (var i=0; i < this.layers.length; i++) {
			if (this.layers[i].id === layerId) return true;
		}
		
		return false;
	}
	
	static FromJSON(json) {
		var c = new Configuration();
		
		c.id = json.id;
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