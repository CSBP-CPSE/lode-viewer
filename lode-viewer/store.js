/**
 * The Store class contains various utility methods used to store lode-viewer map 
 * properties in localStorage.
 * @class
 */
export default class Store { 
	
	/**
	 * Get the lode-map value from localStorage
	 * @returns {string} - map name
	 */
	static get Map() {
		return localStorage.getItem("lode-map") || "trans";
	}

	/**
	 * Set the lode-map value in localStorage
	 * @param {string} value - map name (e.g. odhf, odcaf) 
	 */
	static set Map(value) {
		localStorage.setItem("lode-map", value);
	}
	
	/**
	 * Get the lode-center-lat latitude value from localStorage
	 * @returns {number} - latitude value
	 */
	static get Lat() {
		return localStorage.getItem("lode-center-lat") || 60.847;
	}
	
	/**
	 * Set the lode-center-lat latitude value from localStorage
	 * @param {number} value - latitude value
	 */
	static set Lat(value) {
		localStorage.setItem("lode-center-lat", value);
	}
	
	/**
	 * Get the lode-center-lng longitude value from localStorage
	 * @returns {number} - longitude value
	 */
	static get Lng() {
		return localStorage.getItem("lode-center-lng") || -105.3905;
	}
	
	/**
	 * Set the lode-center-lng longitude value from localStorage
	 * @param {number} value - longitude value
	 */
	static set Lng(value) {
		localStorage.setItem("lode-center-lng", value);
	}
	
	/**
	 * Get the lode-zoom map zoom level from localStorage
	 * @returns {number} map zoom level
	 */
	static get Zoom() {
		return localStorage.getItem("lode-zoom") || 2;
	}
	
	/**
	 * Set the lode-zoom map zoom level from localStorage
	 * @param {number} value - map zoom level
	 */
	static set Zoom(value) {
		localStorage.setItem("lode-zoom", value);
	}
	
	/**
	 * Get the lode-opacity vector opacity level from localStorage
	 * @returns {number} - opacity value
	 */
	static get Opacity() {
		return localStorage.getItem("lode-opacity") || 0.75;
	}
	
	/**
	 * Set the lode-opacity vector opacity level in localStorage
	 * @param {number} value - opacity value ranging from 0 - 1.
	 */
	static set Opacity(value) {
		localStorage.setItem("lode-opacity", value);
	}
	
	/**
	 * Get the lode-layer layer from localStorage
	 * @returns {string} - layer name
	 */
	static get Layer() {
		return localStorage.getItem("lode-layer") || "da";
	}
	
	/**
	 * Set the lode-layer layer from localStorage
	 * @param {string} value - layer name
	 */
	static set Layer(value) {
		localStorage.setItem("lode-layer", value);
	}
}