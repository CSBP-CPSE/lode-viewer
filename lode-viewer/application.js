import Other from "../mapbox-tools/tools/other.js";	// TODO : yiich that name sucks
import Factory from "../mapbox-tools/tools/factory.js";
import Templated from "../basic-tools/components/templated.js";
import Core from "../basic-tools/tools/core.js";
import Net from "../basic-tools/tools/net.js";
import Util from "../basic-tools/tools/util.js";
import Dom from "../basic-tools/tools/dom.js";
import Table from "./table.js";
import Store from "./store.js";

export default class ProxApp extends Templated { 
	
	constructor(node, config) {
		super(node);
		
		this.config = config;
		this.current = this.config.maps[Store.Map];

		if (!this.current) this.current = Util.FirstProperty(this.config.maps);
		
		this.AddMap();	
		this.AddSearch();	
		this.AddBaseControls();		
		this.AddGroup();
		this.AddMenu();
		this.AddTable();
		
		this.Node('instructions').innerHTML = this.current.Description;
	}
	
	Template() {
		return "<div class='search-container'>" +
				  "<span class='wb-inv'>nls(Inv_Search_Instructions)</span>" + 
				  "<label class='search-label'>nls(App_Search_Label)" +
				     "<div handle='search' class='search'></div>" +
			      "</label>" +
				  "<div class='inv-container'>" +
					"<a href='#prx-table' class='wb-inv wb-show-onfocus wb-sl'>nls(Inv_Skip_Link)</a>" + 
				  "</div>" +
			   "</div>" +
			   "<div handle='instructions' class='instructions'></div>" + 
               "<div class='map-container'>" +
                  "<div handle='map' class='map'></div>" +
               "</div>" +
			   "<div class='table-container'>" +
				  "<div handle='table' class='table'></div>" +
			   "</div>" +
			   "<div class='link-symbols-container'>" +
				  "<a href='nls(STS_Link)' class='link-symbols' target='_blank' title='nls(STS_Title)'>nls(STS_Label)</a>" +
			   "</div>";
	}

	AddMap() {
		var token = "pk.eyJ1IjoiZGVpbC1sZWlkIiwiYSI6ImNrMzZxODNvNTAxZjgzYm56emk1c3doajEifQ.H5CJ3maS0ZuxX_7QTgz1kg";
		
		this.map = Factory.Map(this.Node("map"), token, this.current.Style, [Store.Lng, Store.Lat], Store.Zoom);
		
		// Hooking up all events
		this.map.On("StyleChanged", this.OnMapStyleChanged_Handler.bind(this));
		this.map.On("MoveEnd", this.OnMapMoveEnd_Handler.bind(this));
		this.map.On("ZoomEnd", this.OnMapZoomEnd_Handler.bind(this));
		this.map.On("Click", this.OnMapClick_Handler.bind(this));
	}

	AddBaseControls() {
		var fullscreen = Factory.FullscreenControl(Core.Nls("FullScreen_Title"));
		var navigation = Factory.NavigationControl(false, true, Core.Nls("Navigation_ZoomIn_Title"), Core.Nls("Navigation_ZoomOut_Title"));
		var scale = Factory.ScaleControl("metric");
		
		this.map.AddControl(fullscreen, "top-left");
		this.map.AddControl(navigation, "top-left");
		this.map.AddControl(scale);
	}

	AddSearch() {
		// TODO: Which items should be in the search box? always CSDs or data dependent?
		this.config.search.items = this.config.search.items.map(i => {
			return { 
				id : i[0], 
				name : i[1],
				label : `${i[1]} (${i[0]})`, 
				extent : [[i[2], i[3]], [i[4], i[5]]] 
			}
		});
		
		
		// Add top-left search bar
		var search = Factory.SearchControl(this.config.search.items, Core.Nls("Search_Placeholder"), Core.Nls("Search_Title"));
		
		search.Place(this.Node("search"));
		
		search.On("Change", this.OnSearchChange_Handler.bind(this));
	}

	AddGroup() {
		// Top-right group for legend, etc.		
		this.group = {
			legend : Factory.LegendControl(this.current.Legend, this.current.Title, this.current.Subtitle)
		}
						
		this.map.AddControl(Factory.Group(this.group));
		
		// TODO : Will all different datasets include a legend with toggles?
		this.group.legend.On("LegendChange", this.OnLegend_Changed.bind(this));
	}

	OnLegend_Changed(ev) {
		var opacities = ev.state.map(i => Number(i.checkbox.checked));

		// TODO : Not all datasets will be circles
        this.map.Choropleth([this.current.LayerIDs[0]], 'circle-color', this.current.Legend, opacities);
        this.map.ChoroplethVarOpac([this.current.LayerIDs[0]], 'circle-stroke-color', this.current.Legend, opacities);

        this.map.ChoroplethVarOpac( [this.current.LayerIDs[1]] , 'text-color', this.current.Legend, opacities);
    }
	
	AddMenu() {
		// Top-left menu below navigation
		var bookmarks = Factory.BookmarksControl(this.config.bookmarks);
		
		this.menu = Factory.MenuControl();
		
		this.map.AddControl(this.menu, "top-left");
		
		this.menu.AddButton("home", "assets/globe.png", Core.Nls("Home_Title"), this.OnHomeClick_Handler.bind(this));
		this.menu.AddPopupButton("bookmarks", "assets/bookmarks.png", Core.Nls("Bookmarks_Title"), bookmarks, this.map.Container);
		
		Dom.AddCss(this.menu.Button("bookmarks").popup.Node("root"), "prx");
				
		bookmarks.On("BookmarkSelected", this.OnBookmarkSelected_Handler.bind(this));
	}
	
	AddTable() {
		// TODO : Table will also be by dataset
		this.table = new Table(this.Node("table"), { summary:this.config.table, currId: 0, currFile: 0 });
	}
	
	OnHomeClick_Handler(ev) {
		this.map.FitBounds([[-173.457, 41.846], [-17.324, 75.848]]);
	}
	
	OnBookmarkSelected_Handler(ev) {
		this.menu.Button("bookmarks").popup.Hide();
		
		this.map.FitBounds(ev.item.extent, { animate:false });
	}

	OnMapStyleChanged_Handler(ev) {		
		this.map.SetClickableMap();
		
		// TODO: Not always circles
		this.map.Choropleth([this.current.LayerIDs[0]], 'circle-color', this.current.Legend, 1);
	}
	
	OnMapMoveEnd_Handler(ev) {		
		Store.Lat = this.map.Center.lat;
		Store.Lng = this.map.Center.lng;
	}
	
	OnMapZoomEnd_Handler(ev) { 		
		Store.Zoom = this.map.Zoom;
	}
	
	OnMapClick_Handler(ev) {
		// TODO : Layers will not always be odhf, maybe no CSDs...
		var features = this.map.QueryRenderedFeatures(ev.point, ["odhf", "csd-search"]);
				
		var hf = null;
		var csd = null;
				
		features.forEach(f => {
			if (f.layer.id == "odhf") hf = f;
			if (f.layer.id == "csd-search") csd = f;
		});
		
		if (hf) {
			// TODO : Handle lookups, string formats
			var html = Other.HTMLize(hf.properties, this.current.Fields, Core.Nls("Map_Not_Available"));
			
			this.map.InfoPopup(ev.lngLat, html);
		}

		if (!csd) return;
				
		var item = null;
				
		this.config.search.items.forEach(i => {
			if (i.id == csd.properties.uid) item = i;
		});
		
		if (!item) return;
		
		// ie11 doesn't support find
		var item = this.config.search.items.filter(function (i) {
            return i.id === csd.properties.uid;
        })[0];
		
		this.table.UpdateTable(item);
	}
	
	// TODO : Modify if not using CSDs
	OnSearchChange_Handler(ev) {
		var legend = [{
			color : this.config.search.color,
			value : ["==", ["get", this.config.search.field], ev.item.id]
		}, {
			color : [255, 255, 255, 0]
		}];

		this.table.UpdateTable(ev.item);
		
		this.map.Choropleth(["csd-search"], 'fill-outline-color', legend, this.group.opacity.opacity);
		
		this.map.FitBounds(ev.item.extent, { padding:30, animate:false });
	}
}