# Lode-Viewer Structure Notes:
## Source Tree: 
A quick overview of the source tree structure for the project, including a short description for each items in the tree.

```
src/
├── assets/ # image files used by the app. e.g. button icons
├── config/ # collection of app config files
│   ├── maps/ # directory containing map config files for different datasets
│   ├── tables/ # directory containing table config files for different datasets
│   ├── config.application.json # main application config file containing a list of map config files
│   ├── config.bookmarks.json # contains a list of view extents for metropolatin locations in Canada
│   ├── config.credentials.json # contains credential information used by the app (e.g. mapbox access token)
│   ├── config.nls.json # contains a list of localized strings for UI elements in both English and French
│   └── config.search.json # contains a list of view extents for each Census Subdivision in Canada.
├── data/ # table data for each of the viewer datasets
├── reference/ # External libraries
│   ├── mapbox-gl.css # mapbox-gl styling
│   ├── mapbox-gl.js # mapbox-gl library
│   └── promiser.min.js # promise library
├── web-mapping-components/
│   └── web-mapping-components.js # build of web-mapping-components library
├── wet-boew4b/ # Web-Experience-Toolkit library (https://wet-boew.github.io/wet-boew/index-en.html)
├── application.js # Adds viewer components to webpage and binds event handlers for components
├── configuration.js # Contains logic for working with config files
├── index-en.html # English version of HTML document
├── index-fr.html # French version of HTML document
├── main.js # Entry point of application. Viewer code is placed in #app-container div in index-en.html or index-fr.html
├── table.js # Contains logic to make a table view and handles updating the table data
└── workaround.js # Provides lookup methods for formatting/localizing content
```

