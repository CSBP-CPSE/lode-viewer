import geopandas as gpd
import util as u

from pathlib import Path, PurePath


# Generate the CSD bounding boxes for the search bar
def CreateBoundingBoxes(CSD, oFile):
    cPath = PurePath("./output", "./config")

    Path(cPath).mkdir(parents=True, exist_ok=True)

    df = gpd.read_file(CSD)

    data = {"id": "search", "layer": "csd-search", "field": "uid", "color": [175, 30, 40, 1], "items": []}

    for index, row in df.iterrows():
        bb = row.geometry.bounds
        line = [row.CSDUID, row.CSDNAME, u.Truncate(bb[0], 6), u.Truncate(bb[1], 6), u.Truncate(bb[2], 6), u.Truncate(bb[3], 6)]
        data["items"].append(line)

    u.DumpJSON(cPath.joinpath(oFile), data)


CreateBoundingBoxes('./source/CSD/CSD.shp', 'config.search.json')