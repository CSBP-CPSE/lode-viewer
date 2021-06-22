# General Lode-Viewer Notes:
A collection of notes regarding the use of the Lode-Viewer.

## Updating Core.root string:
Depending on your project's requirements, you may need to update your Core.root string which is defined in the application's main.js file. For example, the default, `Core.root = "./";` but in the context of [Lode-Viewer](https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2020014-eng.htm) the `Core.root = "./2020014/";`.

## Specifying the Mapbox access token:
If you need to update/specify the Mapbox access token for you app, you can do so within the `/src/config/config/config.credentials.json` file. 

Example:
```javascript
{
	"mapbox": {
		"accessToken": "Your-Mapbox-Access-Token"
	}
}
```

Note: This string should not be committed to github, and should remain private. 

## Adding new datasets to Lode-Viewer App: 
See `/docs/add-dataset.md` for an indepth overview of how to add new datasets.
