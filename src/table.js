import { Templated, Core, Dom, Net, Util } from './web-mapping-components/web-mapping-components.js';
import Workaround from "./workaround.js";

export default Core.Templatable("Basic.Components.Table", class Table extends Templated {

	set caption(value) { this.Node('caption').innerHTML = value; }

	/**
	 * Table class constructor
	 * 
	 * @constructor
	 * @param {object} container the HTML element that will contain the table.
	 * @param {object} options table options
	 *  options.path - path to the table data e.g. `data/<dataset-name>`
	 *  options.summary - an object containing a summary of how many data json files/pages 
	 * 		of content are available for each census sub division.
	 *  options.fields - list of table field names provided by the table config file
	 *  options.title - string representing the table title 
	 */
	constructor(container, options) {	
		super(container, options);
		
		this.path = options.path;
		this.summary = options.summary;
		this.fields = options.fields;
		this.title = options.title;
		
		this.current = {
			item : null,
			page : 1,
			max : null
		}

		// this.Node("description").innerHTML = options.description;

		// bind click events on prev/next table buttons to handlers
		this.Node('prev').addEventListener('click', this.OnButtonPrev_Handler.bind(this));
		this.Node('next').addEventListener('click', this.OnButtonNext_Handler.bind(this));
		
		this.fields.forEach(f => this.AddHeader(f));
	}

	// HTML template for table-widget
	Template() {
		return "<div class='table-widget'>" +
				  "<h2 handle='title'>nls(Table_Title_Default)</h2>" +
				  
			      "<a id='lode-table' handle='message' class='table-message'>nls(Table_Message)</a>"+
				  
			      "<div handle='table' class='table-container hidden'>" + 
					 "<summary handle='description'></summary>" +
				     "<table>" +
				        "<thead>" + 
				           "<tr handle='header'></tr>" + 
				        "</thead>" +
				        "<tbody handle='body'></tbody>" + 
				     "</table>" + 
				     "<div class='navigation'>" + 
					    `<button handle='prev' title='nls(Table_Previous_Button)' disabled><img src='${Core.root}assets/arrow-left.png'></button>`+
					    "<span handle='current' class='current'></span>"+ 
					    `<button handle='next' title='nls(Table_Next_Button)' disabled><img src='${Core.root}assets/arrow-right.png'></button>`+
				     "</div>" + 
			      "</div>" + 
			   "</div>"
	}

	/**
	 * Add a table header element to the table
	 * @param {object} f table field
	 */
	AddHeader(f) {
		Dom.Create("th", { innerHTML:f.label, className:f.type }, this.Node("header"));
	}

	GetDataFileUrl(file) {
		var url = window.location.href.split("/");
		
		url.splice(url.length - 1, 1);
		url.push(file);
		
		return url.join("/");
	}

	//Update the table content with the correct data of the DBU
	Populate(item, data) {		
		Dom.Empty(this.Node('body'));

		data.shift();

		data.forEach(rData => {
			if (rData.length == 0) return;
			
			var row = Dom.Create("tr", { className:"table-row" }, this.Node('body'));
			
			rData.forEach((cData, i) => {
				// WORKAROUND to fix fields (there's another one in application.js)
				var value = Workaround.FixField(this.fields[i].id, cData);
				
				var css = `table-cell ${this.fields[i].type}`;
				
				Dom.Create("td", { innerHTML:value, className:css }, row);
			});
		});
	}
	
	/**
	* Update the table with the correct DBUID data 
	*
	* @param {object} item the item that was used in the search bar
	* @param {number} page the current page number.
	*/
	UpdateTable(item, page) {	
		// Set current DB
		this.current.page = page || 1;
		this.current.item = item;
		this.current.max = this.summary[item.id] || 0;
		
		this.Node("title").innerHTML =  Util.Format(this.title, [item.label]);
		
		if (this.current.max == 0) {
			this.Node("message").innerHTML = Core.Nls("Table_No_Data");
			
			Dom.AddClasses(this.Node("table"), "hidden");
			Dom.RemoveClass(this.Node("message"), "hidden");
			
			return;
		};
		
		// Get CSV file for selected DB. Extension is json because of weird server configuration. Content is csv.		
		var file = `${Core.root}${this.path}\\${this.current.item.id}_${this.current.page}.json`;
		var url = this.GetDataFileUrl(file);	
		
		Net.Request(url).then(ev => {
			var data = Util.ParseCsv(ev.result);
			
			this.Populate(item, data);
			
			// Update table UI
			this.Node('current').innerHTML = Core.Nls("Table_Current_Page", [this.current.page, this.current.max]);
			
			this.ToggleButtons();
			
			Dom.ToggleClass(this.Node("message"), "hidden", true);
			Dom.ToggleClass(this.Node("table"), "hidden", false);
		}, this.OnAsyncFailure);
	}

	// Disable buttons if current page exceeds the min or max page numbers
	ToggleButtons() {
		this.Node('prev').disabled = (this.current.page <= 1);
		this.Node('next').disabled = (this.current.page >= this.current.max);
	}

	/**
	 * Handler for clicking the table previous page button
	 * - update current page value
	 * - update table content
	 * @param {object} ev mouse click event
	 */
	OnButtonPrev_Handler(ev) {
		this.current.page--;
		
		this.UpdateTable(this.current.item, this.current.page);
	}

	/**
	 * Handler for clicking the table next page button
	 * - update current page value
	 * - update table content
	 * @param {object} ev mouse click event
	 */
	OnButtonNext_Handler(ev) {
		this.current.page++;
		
		this.UpdateTable(this.current.item, this.current.page);
	}
	
	OnAsyncFailure(ev) {
		console.log(ev.error.toString());
	}
})