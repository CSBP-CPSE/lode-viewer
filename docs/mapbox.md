# Mapbox Help File:
The following help file contains various notes related to working with mapbox.

## How To Install Tippecanoe:
[Tippecanoe](https://github.com/mapbox/tippecanoe) can be installed with conda forge:

Example: `conda install -c conda-forge tippecanoe`

## Convert Geographic Data Into A Mapbox Tiles (mbtiles) File:
Mapbox studio can add layers to a map in the form of vector tiles (mbtiles). There are two main ways to convert geographic data into mbtiles; 

1) The first way is to upload the geographic data as a tileset through Mapbox studio. Mapbox will auto convert the geographic data to mbtiles format, which can be added as a layer to a map. 

Note: When Mapbox converts the data, no options are available to configure the mbtiles output. Depending on the data being converted, Mapbox may limit zoom ranges, and consequently you may need to generate the mbtiles file yourself if the auto-generated version isn't sufficient. 

2) Alternatively you can also convert the data using Mapbox's tippecanoe, and then upload the mbtile file in Mapbox studio.

Example: `tippecanoe -z12 -o outputfile.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping --force inputfile.json`

Options:
* `--force`: overwrite existing output
* `--drop-densest-as-needed`: If tiles are too large, try to drop the least visible features at each zoom level. 
* `--extend-zooms-if-still-dropping`: Add zoom levels until a zoom level can display all features.
* `-z12`: Output tiles at zoom levels 0-12.
* `-o`: Specify the output name for the mbtiles file.

Note: A more complete list of tippecanoe options can be found on the [Github website](https://github.com/mapbox/tippecanoe).

## Steps To Add And Use A New Tileset Through Mapbox Studio:
To add and use a tileset through Mapbox Studio requires two steps; Upload a tileset, and add that tileset layer in a map style document.

Add a new tileset:
1. Login to Mapbox.
2. Click on the user account icon (top-right corner of the screen).
3. Select **Studio** from the drop down menu.
4. Click on the menu option **Tilesets** (located on the top menu bar).
5. Click on **New Tileset** button. 
6. Select the file that needs to be uploaded.

Use the new tileset in the map style:
1. Click on the menu option **Styles** (located on the top menu bar).
2. Select and open the map style you want to add the tileset layer to.
3. Click the **+** add new layer button
4. Select the Tileset source you added in the previous step.

