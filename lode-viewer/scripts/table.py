import pandas as pd
import geopandas as gpd
import util as u

from shapely.geometry import Point
from pathlib import Path, PurePath


def BuildDf(iFile):
    df = pd.read_csv(iFile, index_col=False, encoding='utf-8', dtype={'CSDuid': str})

    df = df[~df.latitude.isnull()][~df.longitude.isnull()]

    return df


def CreateTableConfig(path, config):
    jPath = PurePath("./data", path)
    cPath = PurePath("./output", "./config", "./tables")

    Path(cPath).mkdir(parents=True, exist_ok=True)

    del config["source"]

    config["path"] = str(jPath)

    file = 'config.table.' + path.lower() + ".json"

    u.DumpJSON(cPath.joinpath(file), config)


def CreateTableFiles(df, path, drop, config):
    tPath = PurePath("./output", "./data", path)

    Path(tPath).mkdir(parents=True, exist_ok=True)

    split = [pd.DataFrame(y) for x, y in df.groupby('CSDuid')]

    config["summary"] = {}

    for s in split:
        CSD = str(s.CSDuid.iloc[0])
        s = s.sort_values('index', ascending=True).drop(columns=drop)
        split_50 = [s[i:i + 49] for i in range(0, len(s), 50)]

        if len(s) > 0:
            config["summary"][CSD] = len(split_50)

        for index, s_50 in enumerate(split_50):
            oFile = CSD + '_' + str(index + 1) + '.json'

            # Output CSV file with json extension because NDM server don't allow CSV files for some reason.
            u.DumpCSV(tPath.joinpath(oFile), s_50)

    CreateTableConfig(path, config)


def CreateShapefile(df, oFile, drop):
    sPath = PurePath("./output", "./shp")

    Path(sPath).mkdir(parents=True, exist_ok=True)

    geometry = [Point(xy) for xy in zip(df.longitude, df.latitude)]

    gdf = gpd.GeoDataFrame(df.drop(columns=drop), dtype='str', crs={'init': 'epsg:4326'}, geometry=geometry)

    gdf.to_file(sPath.joinpath((oFile)), driver="ESRI Shapefile", index=True)


# Base table configuration, this needs to be changed by dataset
config = u.ReadJSON('./source/Tables/ODHF/odhf.json')

df = BuildDf(config["source"])

drop = u.GetDropFields(df, config["fields"])

CreateTableFiles(df, config["id"], drop, config)

# CreateShapefile(df, config["id"] + ".shp", drop)