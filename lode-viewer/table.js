import Templated from '../basic-tools/components/templated.js';
import Core from '../basic-tools/tools/core.js';
import Dom from '../basic-tools/tools/dom.js';
import Net from "../basic-tools/tools/net.js";
import Util from "../basic-tools/tools/util.js";

export default Core.Templatable("Basic.Components.Table", class Table extends Templated {

	set caption(value) { this.Node('caption').innerHTML = value; }

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

		this.Node('prev').addEventListener('click', this.OnButtonPrev_Handler.bind(this));
		this.Node('next').addEventListener('click', this.OnButtonNext_Handler.bind(this));
		
		this.fields.forEach(f => this.AddHeader(f.label));
	}

	Template() {
		return "<div class='table-widget'>" +
				  "<h2 handle='title'>nls(Table_Title_Default)</h2>" +
				  
			      "<div id='lode-table' handle='message' class='table-message'>nls(Table_Message)</div>"+
				  
			      "<div handle='table' class='table-container hidden'>" + 
					 "<summary handle='description'></summary>" +
				     "<table>" +
				        "<thead>" + 
				           "<tr handle='header'></tr>" + 
				        "</thead>" +
				        "<tbody handle='body'></tbody>" + 
				     "</table>" + 
				     "<div class='navigation'>" + 
					    "<button handle='prev' title='nls(Table_Previous_Button)' disabled><img src='assets/arrow-left.png'></button>"+
					    "<span handle='current' class='current'></span>"+ 
					    "<button handle='next' title='nls(Table_Next_Button)' disabled><img src='assets/arrow-right.png'></button>"+
				     "</div>" + 
			      "</div>" + 
			   "</div>"
	}

	AddHeader(label) {
		Dom.Create("th", { innerHTML:label }, this.Node("header"));
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
				var value = cData;

				Dom.Create("td", { innerHTML:value, className:"table-cell" }, row);
			});
		});
	}
	
	/**
	* Update the table with the correct DBUID data 
	*
	* Parameters :
	* item : the item that was used in the search bar
	* Return : none
	*/
	UpdateTable(item, page) {	
		// Set current DB
		this.current.page = page || 1;
		this.current.item = item;
		this.current.max = this.summary[item.id] || 0;
		
		this.Node("title").innerHTML =  Util.Format(this.title, [item.label]);
		
		if (this.current.max == 0) {
			this.Node("message").innerHTML = Core.Nls("Table_No_Data");
			
			Dom.AddCss(this.Node("table"), "hidden");
			Dom.RemoveCss(this.Node("message"), "hidden");
			
			return;
		};
		
		// Get CSV file for selected DB. Extension is json because of weird server configuration. Content is csv.		
		var file = `${this.path}\\${this.current.item.id}_${this.current.page}.json`;
		var url = this.GetDataFileUrl(file);	
		
		Net.Request(url).then(ev => {
			var data = Util.ParseCsv(ev.result);
			
			this.Populate(item, data);
			
			// Update table UI
			this.Node('current').innerHTML = Core.Nls("Table_Current_Page", [this.current.page, this.current.max]);
			
			this.ToggleButtons();
			
			Dom.ToggleCss(this.Node("message"), "hidden", true);
			Dom.ToggleCss(this.Node("table"), "hidden", false);
		}, this.OnAsyncFailure);
	}

	ToggleButtons() {
		this.Node('prev').disabled = (this.current.page <= 1);
		this.Node('next').disabled = (this.current.page >= this.current.max);
	}

	OnButtonPrev_Handler(ev) {
		this.current.page--;
		
		this.UpdateTable(this.current.item, this.current.page);
	}

	OnButtonNext_Handler(ev) {
		this.current.page++;
		
		this.UpdateTable(this.current.item, this.current.page);
	}
	
	OnAsyncFailure(ev) {
		console.log(ev.error.toString());
	}
})