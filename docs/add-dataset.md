# Adding New Datasets to LODE Viewer

The following steps detail how to add additional datasets to the [LODE viewer](https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2020014-eng.htm). 

After cloneing/downloading the entire [LODE-Viewer GitHub repo](https://github.com/CSBP-CPSE/lode-viewer), there are two main steps to add a dataset:

**Steps to add a new data to the LODE Viewer**: 
1. **Table Step**: Prepare table data and create a table configuration file in order to show a new dataset in the LODE-Viewer table display. 
2. **Map Step**: Prepare spatial data by creating a tileset (`*.mbtiles`) using [tippecanoe](https://github.com/mapbox/tippecanoe), or by uploading the data within Mapbox Studio, and then creating/updating a Mapbox basemap style with the tileset to be linked to the LODE Viewer. Alternatively, if you don't want to create an mbtiles file for the data you can also specify the data source in the map config file directly (Note: This is required for clustering).

These main steps are further detailed below, but first make sure the dependencies are installed in order to run the required scripts.

## Dependencies 

* Python >= 3.6 and the following packages: 
  * [Pandas](https://pypi.org/project/pandas/), 
  * [GeoPandas](https://pypi.org/project/geopandas/). 
    * NOTE: If your operating system is Windows, GeoPandas should be installed through [Anaconda](https://docs.anaconda.com/anaconda/install/): `conda install geopandas`. If you don't have, or do not want to install, Anaconda, there are some other workarounds, read [GeoPandas "Installation" documentation to learn more](https://geopandas.org/install.html). It is recommended to set up a Python environment.

## 1. Table Step
The table step prepares the new data so that is can be viewed in the LODE-Viewer's table display. This step generates a required table configuration file and converts the original csv table data into a series of JSON documents needed to correctly display it in the LODE-Viewer.

1. Create a new table folder in `./scripts/source/Tables/[dataset name]`. This is where the new dataset will be stored.
2. Add the new dataset (`[dataset name].csv`) to `./scripts/source/Tables/[dataset name]` directory you created in step 1.
3. Create a new `[dataset name].json` in `/lode-viewer/scripts/source/Tables/[dataset name]` using the format shown below.
   - Note: This JSON is used to compile the columns that will appear in the pop up and table view.
```
{
	"id" : "mydatasetID",
	"source" : "./source/Tables/mydataset/mydataset.csv",
	"title": {
		"en": "mydataset English title {0}",
		"fr": "mydataset French title {0}"
	},
	"description": {
		"en": "mydataset English description",
		"fr": "mydataset French description"
	},
	"fields": [
		{
			"id": "mydataset-fieldname-1",
			"en": "mydataset English field name 1",
			"fr": "mydataset French field name 1",
			"type" : "field type e.g. text, numeric"
		},
		...
		{
			"id": "mydataset-fieldname-N",
			"en": "mydataset English field name N",
			"fr": "mydataset French field name N",
			"type" : "field type e.g. text, numeric"
		{
	]
}
```

4. Update the ./scripts/table.py script to match the column names of the dataset being added.
 * To avoid scripting errors due to some temporary hard coding, the following variables need to be updated in the table.py script: 
   * Update `TABLECONFIG` variable with the path for the table configuration json file. e.g. `./source/Tables/mydataset/mydataset.json`
   * Update the `INDEX` variable to the index id column name
   * Update the `CSDUID` variable to the CSD Unique ID column name
   * Update the `LAT` variable to the Latitude column name
   * Update the `LONG` variable to the Longitude column name
5. At this point the data should be prepared and the Python script `./scripts/table.py` can be run  e.g., `python table.py`.
6. The script outputs are a series of JSONs in `./scripts/output/data/[dataset name]` and a table configuration JSON for the table view in `./scripts/output/config/tables/config.table.[dataset name].json`
7. Move the entire folder of JSONs (`./scripts/output/data/[dataset name]`) to `./src/data`.
8. Move the table configuration JSON (`./scripts/output/config/tables/config.table.[dataset name].json`) to `./src/config/tables`.

You should now have the necessary data prepared for the map popup and table views in the LODE viewer.

## 2. Map Configuration

In order to view the dataset on the map, the `[dataset name].csv` needs to be added/stored in Mapbox Studio as `[dataset].mbtiles` or stored as a geojson and referenced by the map config file.

### Creating a mbtiles dataset with Mapbox Studio:

1. Convert the original `[dataset-name].csv` to `[dataset-name].geojson`. This can be accomplished with command line tools like OGR or through GUIs like QGIS.
2. Tilesets (`*.mbtiles`) can be created in multiple ways, including; [tippecanoe](https://github.com/mapbox/tippecanoe), [ogr2ogr](https://gdal.org/programs/ogr2ogr.html), or by uploading the `[dataset-name].geojson` in Mapbox Studio as Mapbox has created an automatic script to convert the `[dataset name].geojson` to the desired `[dataset-name].mbtiles`.
  * If tippecanoe is used here is an example of how to create `[dataset-name].mbtiles`: `tippecanoe -o [dataset-name].mbtiles --base-zoom 0 --force [dataset-name].geojson`
  * If ogr2ogr is used here is an example of how to create `[dataset-name].mbtiles`: `ogr2ogr.exe -progress -f MVT [dataset-name].mbtiles [dataset-name].geojson -dsco MINZOOM=2 -dsco MAXZOOM=14 -dsco MAX_SIZE=500000`
3. In Mapbox Studio, make sure your newly uploaded `[dataset-name].mbtiles` is stored within the [tileset view](https://studio.mapbox.com/tilesets/).
4. If making a new style document, go to the styles tab and copy (duplicate) an existing LODE Viewer dataset style for LODE Viewer. This assures that the same data layers and style properties are incorporated for the new dataset.
5. Open the copied style/or update existing map style in Mapbox Studio. Add or update the data sources to the new `[dataset-name]` and also a `[dataset-name]-labels` map layers.
  * Make sure the `[dataset-name]` layer is set to point type.
  * Make sure the `[dataset-name]-labels` layer is set to symbol type.
6. Save the style, take note of the style URL.

Now in order to incorporate this new dataset Mapbox style to the LODE Viewer, the following map configuration file must be completed:

7. Copy/paste one of the existing `./lode-viewer/config/maps/config.map.[old dataset name].json`, rename the file to `./lode-viewer/config/maps/config.map.[dataset name].json`.
8. Update the map configuration "style" key's value with the new style URL (available in Mapbox Studio). Note if the style hasn't been published yet, you will need to add a `/draft` to the end of the URL.
9. The rest of the `config.map.[dataset name].json` should be updated to reflect the dataset variables that will be included in the thematic map: See Map Configuration Properties below for a full listing of possible properties to update in the map config file.

### Specifying a GeoJSON Data Source:
If you're not creating a new mbtiles dataset with Mapbox Studio you can alternatively specify the name of the geojson data source directly in a new/existing map config document. See map configuration dataSources property below.

10. Last, yet very important, in `./lode-viewer/config/config.applications.json`, add `config.map.[dataset-name].json` to the array. This informs the client to include the new dataset into the user interface!

## Map Configuration Properties:

* `id`: Abbreviated form of the dataset.
* `dataSources`: A list of objects containing details on the name and data information related to each source, 
  * `name`: A string representing the name of the data source.
  * `data`: An object containing details on the source, following the format used by the mapbox API.
    * Note: if the data is stored as a mapbox studio dataset, the URL for the data source will use the following pattern: `https://api.mapbox.com/datasets/v1/<user-id>/<dataset-id>/features?access_token=<api-token>`	
* `year`: Specify the year being referenced by the map, which is used by the year menu control.
* `table`: Add the table configuration file for the dataset, `config.table.[dataset name].json`
* `tables`: Add a dictionary containing multiple table configuration files.
* `layers`: A list of objects containing details on map layers. If the layer already exists in the map style document, you only need to provide the id. Otherwise if its a new layer being added using a source defined in the dataSource property, then the layer will need to be defined using the properties specified by the mapbox API.
  * `id` - A string representing the layer id.
  * `click` - If set to `true`, the layer is clickable.
  * `source` - The name of data source, specified in the `dataSources` property.
  * `type` - If a source if specified, you will also need to provide a mapbox layer type. e.g. `circle`.
  * `filter` - Layer filter settings.
  * `paint` - Layer paint style settings.
  * `layout` - Layer layout settings.
* `title`: Title to appear on the map legend.
* `abbr`: The dataset abbreviation to appear on the map legend.
* `toc`: The properties relating to the Table of Contents control.
* `themes`: A collection of themes used by the themes control.
* `legend`: 
  * `colors`: The colours (as rgb) for the thematic map and legend.
  * `label`: The label to appear on the map legend.
  * `value`: The logic assigning a colour to a dataset variable and an unique value. The only thing that needs to be changed here is the variable name and the value to be coloured for the thematic map.
  * `opacity`: The opacity of the legend item, a value between 0-1, which overrides values updated by the opacity slider control.
  * `group`: The group property allows legends to be divided into groups, which contain a collection of related legend items with it's own group heading.
    * Group Example:
```json
"legend": [
	{
		"color": [255, 0, 0],
		"label": {
			"en": "A",
		"fr": "A"
		},
		"value": ["==", ["get", "type"], "A"]
	},
	{
		"group": {
			"en": "B Group",
			"fr": "Groupe B"
		},
		"items": [
			{
				"color": [0, 0, 128],
				"label": {
					"en": "B-1",
					"fr": "B-1"
				},
				"value": ["==", ["get", "type"], "B-1"]
			},
			{
				"color": [0, 0, 255],
				"label": {
					"en": "B-2",
					"fr": "B-2"
				},
				"value": ["==", ["get", "type"], "B-2"]
			}
		]
	},
	{
		"color": [0, 255, 0],
		"label": {
			"en": "Other",
			"fr": "Autres"
		}
	}
]
```

## Map Configuration File Example:
```json
{
    "id": "my-dataset",
	"dataSources": [
		{
			"name": "foo-bar-data",
			"data": {
				"type": "geojson",
				"data": "https://example.org/foobar.geojson",
				"cluster": true,
				"clusterMaxZoom": 10,
				"clusterRadius": 50
			}
		}
	],
	"style": "mapbox://styles/<mapbox-account-name>/foobarmapstyleid",
    "table": "config/tables/config.table.foobar.json",
    "layers": [
		{
            "id": "foobar",
			"click" : true,
			"type": "circle",
			"source": "foo-bar-data",
			"filter": ["!", ["has", "point_count"]],
			"paint": {
				"circle-color": "#c2c2c2",
				"circle-radius": 6,
				"circle-stroke-width": 0.3,
				"circle-stroke-color": "#5e5e5e"
			}
		}, 
		{
			"id": "foobar-labels",
			"type": "symbol",
			"source": "foo-bar-data",
			"layout": {
				"text-anchor": "bottom-left",
				"text-justify": "center",
				"text-offset": [0.3,0.0],
				"text-field": ["step", ["zoom"], "", 8, ["get", "foobar_name"], 22, ["get", "foobar_name"]],
				"text-font": ["Open Sans Regular"],
				"text-size": 12
			},
			"paint": {
				"text-halo-color": ["step",	["zoom"], "hsla(0, 0%, 100%, 0)", 8, "hsl(0, 0%, 100%)", 22, "hsl(0, 0%, 100%)"],
				"text-halo-width": 1.5,
				"text-color": "#000000"
			}
		}
    ],
    "title": {
        "en": "Foobar dataset",
        "fr": "Foobar dataset"
    },
    "abbr": {
        "en": "FOOBAR",
        "fr": "FOOBAR"
    },
	"legend": [
        {
            "color": [255, 25, 167],
            "label": {
                "en": "Hospitals",
                "fr": "Les hôpitaux"
            },
            "value": ["==", ["get", "foobar_type"], "Hospitals"]
        }, 
        {
            "color": [50, 128, 229],
            "label": {
                "en": "Library",
                "fr": "Les bibliothèque"
            },
            "value": ["==", ["get", "foobar_type"], "Library"]
        }, 
        {
            "color": [255, 214, 10],
            "label": {
                "en": "School",
                "fr": "Les École"
            }
        }
	]
}
```

