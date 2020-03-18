import Templated from '../basic-tools/components/templated.js';
import Core from '../basic-tools/tools/core.js';
import Dom from '../basic-tools/tools/dom.js';
import Net from "../basic-tools/tools/net.js";
import Util from "../basic-tools/tools/util.js";

export default Core.Templatable("Basic.Components.Table", class Table extends Templated {

 
	
	set caption(value) { this.Node('caption').innerHTML = value; }

	constructor(container, options) {	
		super(container, options);
		
		this.summary = options.summary;
		this.currId = 0;
		this.currFile = 0;
	}

	Template() {
		return "<div handle='textWidget'>" +
					"<h2 >Please select a CSD using the search bar to show DB level data for that CSD.</h2>" +
				"</div>"+
				"<div handle='tableWidget' class='table-widget'>" + 
				  "<h2>nls(Table_Title)</h2>" +
				  "<button handle='tablePrev' disabled>Previous</button>"+
				  "<label handle = 'pageNumber'>Page number/Total pages</label>"+ 
				  "<button handle='tableNext' disabled>Next</button>"+
				  "<table handle='table' summary='nls(Table_Summary)'>" +
				     "<thead>" + 
				        "<tr>" + 
						   "<th>nls(Table_Field_DBUID)</th>" + 
						   "<th>nls(Table_Field_empl.idx)</th>" + 
						   "<th>nls(Table_Field_pharm.idx)</th>" + 
						   "<th>nls(Table_Field_child.idx)</th>" + 
						   "<th>nls(Table_Field_health.idx)</th>" + 
						   "<th>nls(Table_Field_groc.idx)</th>" + 
						   "<th>nls(Table_Field_edupri.idx)</th>" + 
						   "<th>nls(Table_Field_edusec.idx)</th>" + 
						   "<th>nls(Table_Field_lib.idx)</th>" + 
						   "<th>nls(Table_Field_parks.idx)</th>" + 
						   "<th>nls(Table_Field_trans.idx)</th>" + 
						   "<th>nls(Table_Field_close)</th>" + 
						"</tr>" + 
				     "</thead>" +
				     "<tbody handle='body'></tbody>" + 
				  "</table>" + 
			   "</div>"
	}





	GetDataFileUrl(file) {
		var url = window.location.href.split("/");
		
		url.splice(url.length - 1, 1);
		url.push(file);
		
		return url.join("/");
	}

	GetMaxFiles(id) {
		return this.summary[id] || 1;
	}

	//Update the table content with the correct data of the DBU
	Populate(data) {
		Dom.Empty(this.Node('body'));

		data.shift();

		data.forEach(rData => {
			if (rData.length == 0) return;
			
			var row = Dom.Create("tr", { className:"table-row" }, this.Node('body'));
			
			rData.forEach(cData => {
				Dom.Create("td", { innerHTML:cData, className:"table-cell" }, row);
			});
		});
	}
	
	OnAsyncFailure(ev) {
		// TODO : Check if this work, probably not
		console.log(ev.error.toString());
	}
	
	/**
	* Update the table with the correct DBUID data 
	*
	* Parameters :
	* id : the DBUID that was used in the search bar
	* Return : none
	*/
	UpdateTable(id, fileId) {
		//console.log("This.currId before " + this.currId)
		this.toggleTable()
		this.currId = id
		//console.log("This.currId " + this.currId)
		//console.log("This.currFile before if" + this.currFile)
		if(fileId == 0){this.currFile = 1}
		else {this.currFile = fileId} 
		//console.log("This.currFile AFTER if" + this.currFile)	


		//var url = this.GetDataFileUrl("data/" + id + "_1.csv");
		var url = this.GetDataFileUrl("data/" + id + "_" + this.currFile +".csv");	
		
		Net.Request(url).then(ev => {
			var data = Util.parseCsv(ev.result);
			
			this.Populate(data);
		}, this.OnAsyncFailure);

		this.Node('pageNumber').innerHTML = "Page " + this.currFile + " of " + this.GetMaxFiles(this.currId)
		this.toggleButtons(this.currFile, this.GetMaxFiles(this.currId))
	}



	handlePerv() {
		//console.log("Previous clicked")
		//console.log("this.currFile " + this.currFile)
		//console.log("this.currId " + this.currId)
		if(this.currFile > 1){
			this.UpdateTable(this.currId,this.currFile-1)
			this.toggleButtons(this.currFile, this.GetMaxFiles(this.currId))
		}
	}


	handleNext() {
		//console.log("Next clicked")
		//console.log("id = "+this.currId)
		//console.log("max_file = " + this.GetMaxFiles(this.currId))
		//console.log("currFile" + this.currFile)
		if(this.currFile > 0 && this.currFile < this.GetMaxFiles(this.currId)){
			this.UpdateTable(this.currId,this.currFile+1)
			this.toggleButtons(this.currFile, this.GetMaxFiles(this.currId))
		} 
	}

	toggleButtons(fileNum, maxFileNum){
		if(fileNum <=1 && this.Node('tablePrev').disabled == false) {this.Node('tablePrev').disabled = true}
		if(fileNum >1 && this.Node('tablePrev').disabled == true) {this.Node('tablePrev').disabled = false}
		if(fileNum >= maxFileNum && this.Node('tableNext').disabled == false) {this.Node('tableNext').disabled = true}
		if(fileNum <maxFileNum && this.Node('tableNext').disabled == true) {this.Node('tableNext').disabled = false}
	}
	
	toggleTable(){
		/*
		console.log("tableWidget is ") + this.Node('tableWidget').style.visibility;
		if(this.Node('tableWidget').style.visibility === 'hidden' &&  this.Node('textWidget').style.visibility ==='visible'){
			this.Node('tableWidget').style.visibility = 'visible';
			this.Node('textWidget').style.visibility = 'hidden';
		} */
		if(this.Node('tableWidget').style.visibility === 'hidden'){
			this.Node('tableWidget').style.visibility = 'visible';
		}
		if(this.Node('textWidget').style.visibility === 'visible'){
			this.Node('textWidget').style.visibility = 'hidden';
		}
	}



})