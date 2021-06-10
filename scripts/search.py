"""
Name: search.py
Description: Script used to generate search configuration files, containing a
list of valid search items.
"""
import geopandas as gpd
import util as u
from pathlib import Path, PurePath



def CreateSearchItems(options):
    """
    Generates the search items for the search bar
    :param options {dictionary} - contains the options for the generating the search data
    Options Example:
    {
        "input": "input_file",
        "output": "output_file_name",
        "uid": "unique_id_column_name_of_search_location",
        "name": "name_column_of_search_location"
    }
    """
    cPath = PurePath("./output", "./config")

    Path(cPath).mkdir(parents=True, exist_ok=True)

    df = gpd.read_file(options['input'])

    data = {"id": "search", "layer": "csd-search", "field": "uid", "color": [175, 30, 40, 1], "items": []}

    # Generate search items for each row in input
    for index, row in df.iterrows():
        bb = row.geometry.bounds
        line = [row[options['uid']], row[options['name']], u.Truncate(bb[0], 6), u.Truncate(bb[1], 6), u.Truncate(bb[2], 6), u.Truncate(bb[3], 6)]
        data["items"].append(line)

    # Dump generated search config file
    u.DumpJSON(cPath.joinpath(options['output']), data)


# Create search items
CreateSearchItems({
    "input": "./source/CSD/CSD.shp",
    "output": "config.search.json",
    "uid": "CSDUID",
    "name": "CSDNAME"
})

