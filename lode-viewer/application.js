import Other from "../mapbox-tools/tools/other.js";	// TODO : yiich that name sucks
import Factory from "../mapbox-tools/tools/factory.js";
import Core from "../basic-tools/tools/core.js";
import Net from "../basic-tools/tools/net.js";
import Util from "../basic-tools/tools/util.js";
import Dom from "../basic-tools/tools/dom.js";
import Store from "./store.js";

export default class ProxApp { 
	
	constructor(config) {		
		this.maps = config.maps;
		this.bookmarks = config.bookmarks;

		this.config = this.maps[Store.Map];
		
		if (!this.config) this.config = Util.FirstProperty(this.maps);
		
		this.Initialize();
	}
	
	Initialize() {	
		var token = "pk.eyJ1IjoiZGVpbC1sZWlkIiwiYSI6ImNrMzZxODNvNTAxZjgzYm56emk1c3doajEifQ.H5CJ3maS0ZuxX_7QTgz1kg";

		this.map = Factory.Map("map", token, this.config.Style, [Store.Lng, Store.Lat], Store.Zoom);
		// this.search = Factory.SearchControl(Core.Nls("Search_Placeholder"));

		// Add top-left search bar
		// this.map.AddControl(this.search, "top-left");

		// Adding basic controls to map
		this.map.AddControl(Factory.NavigationControl(), "top-left");
		this.map.AddControl(Factory.ScaleControl("metric"));
		
		// Adding custom group controls
		this.AddGroup();
		this.AddMenu();

		// Hooking up all events
		this.map.On("StyleChanged", this.OnMapStyleChanged_Handler.bind(this));
		this.map.On("MoveEnd", this.OnMapMoveEnd_Handler.bind(this));
		this.map.On("ZoomEnd", this.OnMapZoomEnd_Handler.bind(this));
		this.map.On("Click", this.OnMapClick_Handler.bind(this));
		
		// this.search.On("Change", this.OnSearchChange_Handler.bind(this));
	}
	
	AddMenu() {
		// Top-left menu below navigation
		this.list = Factory.MapsListControl(this.maps);
		this.bookmarks = Factory.BookmarksControl(this.bookmarks);
		
		this.menu = Factory.MenuControl();
		
		this.menu.AddPopupButton("maps", "assets/layers.png", Core.Nls("Maps_Title"), this.list);
		this.menu.AddPopupButton("bookmarks", "assets/bookmarks.png", Core.Nls("Bookmarks_Title"), this.bookmarks);
		
		this.map.AddControl(this.menu, "top-left");
		
		this.list.On("MapSelected", this.OnListSelected_Handler.bind(this));
		
		this.bookmarks.On("BookmarkSelected", this.OnBookmarkSelected_Handler.bind(this));
	}
	
	AddGroup() {
		// Top-right group for toc, legend, etc.		
		this.group = {
			legend : Factory.LegendControl(this.config.Legend, this.config.Title, this.config.Subtitle),
			toc : Factory.TocControl(this.config.TOC),
			opacity : Factory.OpacityControl(Store.Opacity)
			// download : Factory.DownloadControl(Net.FilePath("/assets/proximity-measures.csv"))
		}
		
		if (this.config.HasLayer(Store.Layer)) this.group.toc.SelectItem(Store.Layer);
		
		this.map.AddControl(Factory.Group(this.group));
		
		this.group.opacity.On("OpacityChanged", this.OnLegend_OpacityChanged.bind(this));
		this.group.toc.On("LayerVisibility", this.OnTOC_LayerVisibility.bind(this));
	}
	
	OnLegend_OpacityChanged(ev) {		
		Store.Opacity = ev.opacity;
		
		this.map.Choropleth(this.config.LayerIDs, this.config.Legend, this.group.opacity.opacity);
	}
	
	OnBookmarkSelected_Handler(ev) {
		this.menu.Button("bookmarks").popup.Hide();
		
		this.map.Center = ev.item.center;		
		this.map.Zoom = ev.item.zoom;	
	}
		
	OnListSelected_Handler(ev) {
		this.menu.Button("maps").popup.Hide();
		
		Store.Map = ev.id;

		// TODO : Check if SetStyle counts as a map load, if it does, we need to reset layer visibility and paint
		// properties instead of setting the style. If it doesn't we're good as is.
		this.map.SetStyle(ev.map.Style);
		
		this.config = ev.map;
		
		this.group.legend.Reload(this.config.Legend, this.config.Title, this.config.Subtitle);
		this.group.toc.Reload(this.config.TOC, Store.Layer);
		
		if (this.config.HasLayer(Store.Layer)) this.group.toc.SelectItem(Store.Layer);
		
		Dom.ToggleCss(this.group.toc.Node("root"), "hidden", !this.config.TOC);
	}
	
	OnTOC_LayerVisibility(ev) {
		this.map.HideLayer(Store.Layer);
				
		Store.Layer = ev.layer;
		
		this.map.ShowLayer(Store.Layer);
	}
	
	OnMapStyleChanged_Handler(ev) {
		// TODO : Issue here, this.config.TOC doesn't meant the layer is available
		if (this.config.HasLayer(Store.Layer)) this.map.ShowLayer(Store.Layer);
		
		this.map.SetClickableLayers(this.config.LayerIDs);
		this.map.Choropleth(this.config.LayerIDs, this.config.Legend, this.group.opacity.opacity)
	}
	
	OnMapMoveEnd_Handler(ev) {		
		Store.Lat = this.map.Center.lat;
		Store.Lng = this.map.Center.lng;
	}
	
	OnMapZoomEnd_Handler(ev) { 		
		Store.Zoom = this.map.Zoom;
	}
	
	OnMapClick_Handler(ev) {
		if (ev.features.length == 0) return;
		
		var html = Other.HTMLize(ev.features[0].properties, this.config.Fields, Core.Nls("Map_Not_Available"));
		
		this.map.InfoPopup(ev.lngLat, html);
	}
	
	OnSearchChange_Handler(ev) {
		debugger;
	}
}