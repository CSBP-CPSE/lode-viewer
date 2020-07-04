import pandas as pd
import geopandas as gpd
import json
import math
import numpy as np
from shapely.geometry import Point
from pathlib import Path, PurePath


def DumpJSON(output, data):
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'), ensure_ascii=False)


def DumpCSV(output, data):
    df = pd.DataFrame(data)

    df.to_csv(output, index=False)


def Truncate(number, digits) -> float:
    stepper = 10.0 ** digits

    return math.trunc(stepper * number) / stepper


def GetDropFields(df, keep):
    drop = list(df.columns)

    for f in keep:
        drop.remove(f["id"])

    return drop


def BuildDf(iFile):
    df = pd.read_csv('./source/odhf_v1.csv', index_col=False, encoding='unicode_escape', dtype={'CSDuid': str})

    df = df[~df.latitude.isnull()][~df.longitude.isnull()]

    return df


def CreateTableConfig(df, path, config):
    jPath = PurePath("./data", path)
    cPath = PurePath("./output", "./config", "./tables")

    Path(cPath).mkdir(parents=True, exist_ok=True)

    config["path"] = str(jPath)

    file = 'config.table.' + path.lower() + ".json"

    DumpJSON(cPath.joinpath(file), config)


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
            DumpCSV(tPath.joinpath(oFile), s_50)

    CreateTableConfig(df.drop(columns=drop), path, config)


def CreateShapefile(df, oFile, drop):
    sPath = PurePath("./output", "./shp")

    Path(sPath).mkdir(parents=True, exist_ok=True)

    geometry = [Point(xy) for xy in zip(df.longitude, df.latitude)]

    gdf = gpd.GeoDataFrame(df.drop(columns=drop), crs={'init': 'epsg:4326'}, geometry=geometry)

    gdf.to_file(sPath.joinpath((oFile)), driver="ESRI Shapefile", index=True)


# Generate the CMA bounding boxes for the bookmarks
def CreateBookmarks(CMA, oFile):
    cPath = PurePath("./output", "./config")

    Path(cPath).mkdir(parents=True, exist_ok=True)

    df = gpd.read_file(CMA, encoding='utf-8')

    data = {"id": "bookmarks", "items": []}

    for index, row in df.iterrows():
        bb = row.geometry.bounds

        line = {"label": row.CMANAME,
                "extent": [[Truncate(bb[0], 6), Truncate(bb[1], 6)], [Truncate(bb[2], 6), Truncate(bb[3], 6)]]}

        data["items"].append(line)

    DumpJSON(cPath.joinpath(oFile), data)


# Generate the CSD bounding boxes for the search bar
def CreateBoundingBoxes(CSD, oFile):
    cPath = PurePath("./output", "./config")

    Path(cPath).mkdir(parents=True, exist_ok=True)

    df = gpd.read_file(CSD)

    data = {"id": "search", "layer": "csd-search", "field": "uid", "color": [175, 30, 40, 1], "items": []}

    for index, row in df.iterrows():
        bb = row.geometry.bounds
        line = [row.CSDUID, row.CSDNAME, Truncate(bb[0], 6), Truncate(bb[1], 6), Truncate(bb[2], 6), Truncate(bb[3], 6)]
        data["items"].append(line)

    DumpJSON(cPath.joinpath(oFile), data)


# Base table configuration, this needs to be changed by dataset
config = {
    "title" : {
        "en": "Detailed table of health facilities in {0}",
        "fr": "Tableau détaillé des établissements de santé pour {0}"
    },
    "description" : {
        "en": "This table contains the health facilities contained in the selected census subdivision.",
        "fr": "Ce tableau contient les établissements de santé contenus dans la sous-division de recensement sélectionnée."
    },
    "fields": [{
            "id": "index",
            "en": "Health facility ID",
            "fr": "ID de l'établissement de santé"
        }, {
            "id": "facility_name",
            "en": "Facility name",
            "fr": "Nom de l'établissement"
        }, {
            "id": "odhf_facility_type",
            "en": "Type",
            "fr": "Type"
        }, {
            "id": "street_no",
            "en": "Street number",
            "fr": "Numéro civique"
        }, {
            "id": "street_name",
            "en": "Street name",
            "fr": "Nom de la rue"
        }, {
            "id": "postal_code",
            "en": "Postal code",
            "fr": "Code postal"
        }, {
            "id": "city",
            "en": "City",
            "fr": "Ville"
        }, {
            "id": "province",
            "en": "Province",
            "fr": "Province"
        }, {
            "id": "latitude",
            "en": "Latitude",
            "fr": "Latitude"
        }, {
            "id": "longitude",
            "en": "Longitude",
            "fr": "Longitude"
        }
    ],
}

df = BuildDf('./source/odhf_v1.csv')

drop = GetDropFields(df, config["fields"])

CreateTableFiles(df, "ODHF", drop, config)

CreateShapefile(df, "ODHF.shp", drop)

CreateBookmarks('./source/CMA/CMA.shp', 'config.bookmarks.json')

CreateBoundingBoxes('./source/CSD/CSD.shp', 'config.search.json')
