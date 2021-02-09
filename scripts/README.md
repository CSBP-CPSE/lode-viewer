# LODE-Viewer Scripts:
A collection of scripts for preparing data and generating configuration files for the LODE-Viewer.

## Directory Structure:
./scripts/
├───source - Directory containing source data used by Python scripts.
│   ├───CMA - Data used by bookmarks.py
│   ├───CSD - Data used by search.py
│   └───Tables - Table data used by table.py
│       ├───ODCAF
│       └───ODHF
├ bookmarks.py - Python script that generates ./src/config/config.bookmarks.json from CMA data.
├ search.py - Python script that generates ./src/config/config.search.json from CSD data
└ table.py - Python script for preparing table data
