import Templated from './templated.js';
import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from "../tools/net.js";
import Util from "../tools/util.js";


export default Core.Templatable("Basic.Components.Table", class Table extends Templated {
	

  set caption(value) { this.Node('caption').innerHMTL = value; }

	constructor(container, options) {	
		super(container, options);
	}

	
	Template() {

		//return "<table id= 'myTable'> <tr> <th>Name</th> <th>Favorite Color</th> </tr> <tr> <td>Bob</td> <td>Yellow</td> </tr> <tr> <td>Michelle</td> <td>Purple</td> </tr> </table>"
		//return "<div> <table id ='myTable'> <thead> <tr> <th>Id</th><th>Name</th><th>Mark</th> </tr> </thead> </table> </div>"
    return "<div> <table handle='myTable' summary='Summary of DBU data'> <tr> <th>DBUID</th> <th>pharm.idx</th> <th>child.idx</th> <th>health.idx</th> <th>groc.idx</th> <th>edupri.idx</th> <th>edusec.idx</th> <th>lib.idx</th> <th>parks.idx</th> <th>trans.idx</th> <th>close</th> <th>uppressed</th> </tr> <tbody handle='tableBody'> </tbody> <tfoot> </tfoot> </table> </div>"
  }


  /**
  * Update the table with the correct DBUID data 
  *
  * Parameters :
  * id : the DBUID that was used in the search bar
  * Return : none
  */
  UpdateTable(id){

    var csvData
    var currId = id
    var currFileName
    var maxNoFiles
    let tableRef = this.Node('myTable');
    let body = this.Node('tableBody');
    var root = window.location.origin

    /* Construct the file name (without the extension) and get the max number of files*/
    var genNameAndGetMax = function(ev){
      var summery = ev.result
      //console.log(summery)
      var id_str = currId.toString()
      //console.log("id_str: " + id_str)
      var maxNoFiles = summery[id_str]
      if(typeof maxNoFiles === 'undefined') maxNoFiles = 1;
      //console.log("max num of files is " + maxNoFiles)
      var name =  id_str + "_1"
      //console.log("file name is " + name)
      return name
    }


    //var p1 = Net.JSON(`http://localhost:82/lode-viewer/data/summary.json`);
    //var p = Net.Request(`http://localhost:82/lode-viewer/data/6205033_1.csv`)
    var p1 = Net.JSON(root + `/lode-viewer/data/summary.json`);

    /*If data is fetched succesfully*/
    var success = function(ev) {
      console.log(csvData)
      return ev.result
    }  


    var failure = function(ev) {
        console.log("error!");
      }


    /*Update the table content with the correct data of the DBU*/
    var populateTable = function(csvArray){
      //let tableRef = document.getElementById('myTable');
      //clear the table rows
      //tableRef.innerHTML = "";

      //clear the table body
      //Dom.Empty(tableRef)
      //tableRef.tBodies.innerHTML = "";
      body.innerHTML = "";

      //console.log("num of col " + csvArray.length)
      var columnCount = csvArray[0].length;
      var row
      //Add the header row.
      /*
          var row = tableRef.insertRow(-1);
          for (var i = 0; i < columnCount; i++) {
              var headerCell = document.createElement("TH");
              headerCell.innerHTML = csvArray[0][i];
              row.appendChild(headerCell);
          } */
 
        //Add the data rows.
        for (var i = 1; i < csvArray.length-1; i++) {
          //row = tableRef.insertRow(-1);
          row = body.insertRow(-1);
          for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = csvArray[i][j];
          }
        }
      }


    /* Construct the full file path, and make the file request. then call a function to parse 
    the file, then call the populateTable funciton*/
      var p2 = function(fileName) {
        //console.log("fileName is" + fileName)  
        //var url = `http://localhost:82/lode-viewer/data/`
        var url = root + `/lode-viewer/data/`
        url = url + fileName + `.csv`
        var p3 =  Net.Request(url)

        //p3.then(success, failure).then(processData).then(populateTable); 
        p3.then(success, failure).then(Util.parseCsv).then(populateTable);
      }


    /*Get the data in the summary file, then call the function genNameAndGetMax, then call p2*/
      p1.then(genNameAndGetMax, failure).then(p2)
    }

  })