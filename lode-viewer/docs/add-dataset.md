# Adding New Datasets to LODE Viewer

The following are steps to follow to add an additional dataset to the LODE viewer. There are two main steps: 

1. **Configuration**: Run the `./lode-viewer/scripts/table.py` to prepare the original dataset (`*.csv`) into the necessary data structures and configuration files to run LODE viewer successfully.
2. **Mapbox**: Create a tileset (`*.mbtiles`) using [tippecanoe](https://github.com/mapbox/tippecanoe) or simply uploading it within Mapbox Studio, and creating a style.

These main steps are further detailed below.

# Dependencies 

In order to follow the steps below, you will first need to install the following dependencies:

- Python >= 3.6 and the following packages: pandas, geopandas (if your OS is Windows, best to install through Anaconda). 

# Configuration

In order to prepare the original dataset (`*.csv`) into the correct configuration formats for the LODE viewer, Python scripts have been prepared.

1. Create a new folder in `./lode-viewer/scripts/source/Tables/[dataset name]`.
2. Add dataset (`[dataset name].csv`) to `./lode-viewer/scripts/source/Tables/[dataset name]`.
3. Create a new `[dataset name].json` from `./lode-viewer/scripts/source/Tables/template.json` in `/lode-viewer/scripts/source/Tables/[dataset name]`.
   - This json is used to compile the columns that will appear in the popup and table view.
   - **If you want postal codes to show up on your popup and table views, then you must name the column `postal_code`**.
   - **Name your id column `index`**.
   - **Name your CSD ID column `CSDUID`**.
5. In `./lode-viewer/scripts/table.py`, update line 71 to the correct file path: `config = u.ReadJSON('./source/Tables/[dataset name]/[dataset name].json')`.
6. Run `./lode-viewer/scripts/table.py`, e.g., `python table.py`.
7. The outputs are a series of *.jsons in `./lode-viewer/scripts/output/data/[dataset name]` and a configuration JSON for the table view in `./lode-viewer/scripts/output/config/tables/config.table.[dataset name].json`
8. Move `./lode-viewer/scripts/output/data/[dataset name]` to `./lode-viewer/data`.
9. Move `./lode-viewer/scripts/output/config/tables/config.table.[dataset name].json` to `./lode-viewer/config/tables`. 

You should now have the necessary data prepared for the popup and table views for the LODE viewer.

Next, you will need to prepare a `config.map.[dataset name].json` related to how the map choropleth design should be:

1. Copy/paste one of the existing `config.map.[old dataset name].json`, rename the file to `config.map.[dataset name].json`.
2. Update the values accordingly.

Last, in `./lode-viewer/config/config.applications.json`, add `config.map.[old dataset name].json` to the array.

# Mapbox Studio

In order to see the dataset on the map, the original `[dataset name].csv` needs to be uploaded into Mapbox Studio as `[dataset].mbtiles`. In order to do this, the following steps need to be completed:

1. Convert the original `[dataset name].csv` to `[dataset name].geojson`. This can be accomplished through command line tools like OGR or through GUIs like QGIS.
2. Create a tileset (`*.mbtiles`) either by using [tippecanoe](https://github.com/mapbox/tippecanoe) for a more customized approach, or simply uploading the `*.geojson` in Mapbox Studio.
3. In Mapbox Studio make sure your newly uploaded `*.mbtiles` is stored within the [tileset view](https://studio.mapbox.com/tilesets/).
4. Next, go to the style tab and copy an existing style for LODE Viewer.
5. Open the copied style in Mapbox Studio, you will then need to update the data sources to uploaded `*.mbtiles` for `[dataset name]` and `[dataset name]-labels` map layers.
6. Save the style and copy the style URL, and this to your `config.map.[old dataset name].json`.
