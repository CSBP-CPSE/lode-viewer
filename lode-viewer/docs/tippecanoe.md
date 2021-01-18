## TILING THE CENSUS BOUNDARIES FOR POPULATION VIEWER
## FLAGS ARE 
## 	--no-line-simplification : keep all polygons vertices, required so you keep continuous coverage without gaps

tippecanoe -o ./mbtiles/PR.mbtiles -zg --force --no-line-simplification PR.geojson
tippecanoe -o ./mbtiles/CD.mbtiles -zg --force --no-line-simplification CD.geojson
tippecanoe -o ./mbtiles/CSD.mbtiles -zg --force --no-line-simplification CSD.geojson
tippecanoe -o ./mbtiles/DA.mbtiles -zg --force --no-line-simplification DA.geojson
tippecanoe -o ./mbtiles/DB.mbtiles -zg --force --no-line-simplification DB.geojson



## TILING THE BUILDINGS FOR POPULATION VIEWER

tippecanoe -z15 -Z10 -o ./../buildings.mbtiles --force --drop-densest-as-needed AB.geojson BC.geojson MB.geojson NB.geojson NL.geojson NS.geojson NT.geojson NU.geojson ON.geojson PE.geojson QC.geojson SK.geojson YT.geojson



## TILING SOME OF THE PROXIMITY MEASURES FOR THE PROXIMITY DATA VIEWER (SOME ARE MISSING BUT THE CALLS SHOULD BE THE SAME)
## FLAGS ARE 
##	--force : overwrite existing output
## 	--no-line-simplification : keep all polygons vertices, required so you keep continuous coverage without gaps
##	--no-tiny-polygon-reduction : also required to avoid gaps between polygons
## 	-y : indicate a field to keep on the tiles
 
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y CMAUID -y trans.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y pharm.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y child.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y health.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y groc.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y edupri.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y edusex.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y lib.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y parks.idx --no-tiny-polygon-reduction DB.geojson
tippecanoe -o DB-prx.mbtiles -z12 --force --no-line-simplification -y DBUID -y CSDUID -y empl.idx --no-tiny-polygon-reduction DB.geojson



## TILING THE ODHF FOR THE LODE-VIEWER
## FLAGS ARE
##	--base-zoom : indicate lowest zoom level, in this case, we force geometries to be visible at all zoom levels

tippecanoe -o ODHF.mbtiles --base-zoom 0 --force ODHF.geojson

winpty docker run -it -v $HOME/tippecanoe:/C:/Tools/apache-tomcat-10.0.0-M7/webapps/deil/web-mapping-dev/lode-viewer/scripts/source/Tables/ODCAF jskeates/tippecanoe:latest tippecanoe -o ODCAF.mbtiles --base-zoom 0 --force odcaf_draft.geojson

winpty docker run -it -v $HOME/tippecanoe:/home/tippecanoe jskeates/tippecanoe:latest tippecanoe -o /C:/Tools/apache-tomcat-10.0.0-M7/webapps/deil/web-mapping-dev/lode-viewer/scripts/source/Tables/ODCAF/ODCAF.mbtiles --base-zoom 0 --force /C:/Tools/apache-tomcat-10.0.0-M7/webapps/deil/web-mapping-dev/lode-viewer/scripts/source/Tables/ODCAF/odcaf_draft.geojson

winpty docker run -it -v $HOME/tippecanoe:/home/tippecanoe jskeates/tippecanoe:latest tippecanoe
