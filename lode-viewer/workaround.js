import Core from '../basic-tools/tools/core.js';

export default class Workaround {
	
	// TODO : This probably won't work for other databases unless they keep the same field namespaceURI
	// It's a workaround for the ODHF because there are still some issues with the data at the time of launch
	static FixField(field, value) {
		if (field === "province" || field === "Prov_Terr") return this.LookupProvince(value, Core.locale);
		
		if (field === "odhf_facility_type" || field === "ODCAF_Facility_Type") return this.LookupType(value, Core.locale);
		
		if (field === "postal_code" || field === "Postal_Code") return value.replace(" ", "&nbsp");
		
		if (field === "facility_name" || field === "Facility_Name") return value.charAt(0).toUpperCase() + value.slice(1);
		
		if (field === "street_name" || field === "Street_Name") return value.charAt(0).toUpperCase() + value.slice(1);
		
		if (field === "city" || field === "City") return value.charAt(0).toUpperCase() + value.slice(1);
		
		return value;
	}
	
	static LookupProvince(abbr, locale) {
		abbr = abbr.trim();	// Hidden whitespace character at the end, weird.
		
		if (abbr === 'nl') return locale === "en" ? "Newfoundland and Labrador" : "Terre-Neuve-et-Labrador";
		if (abbr === 'pe') return locale === "en" ? "Prince Edward Island" : "Île-du-Prince-Édouard";
		if (abbr === 'ns') return locale === "en" ? "Nova Scotia" : "Nouvelle-Écosse";
		if (abbr === 'nb') return locale === "en" ? "New Brunswick" : "Nouveau-Brunswick";
		if (abbr === 'qc') return locale === "en" ? "Quebec" : "Québec";
		if (abbr === 'on') return locale === "en" ? "Ontario" : "Ontario";
		if (abbr === 'mb') return locale === "en" ? "Manitoba" : "Manitoba";
		if (abbr === 'sk') return locale === "en" ? "Saskatchewan" : "Saskatchewan";
		if (abbr === 'ab') return locale === "en" ? "Alberta" : "Alberta";
		if (abbr === 'bc') return locale === "en" ? "British Columbia" : "Colombie-Britannique";
		if (abbr === 'yt') return locale === "en" ? "Yukon" : "Yukon";
		if (abbr === 'nt' || abbr === 'nwt') return locale === "en" ? "Northwest Territories" : "Territoires du Nord-Ouest";
		if (abbr === 'nu') return locale === "en" ? "Nunavut" : "Nunavut";
	}
	
	static LookupType(type, locale) {		
		if (type === "Hospitals") {
			return locale === "en" ? "Hospitals" : "Hôpitaux";

		} else if (type === "Nursing and residential care facilities"){
			return locale === "en" ? "Nursing and residential care facilities" : "Établissements de soins infirmiers et de soins pour bénéficiaires internes";

		} else if (type === "Ambulatory health care services"){
			return locale === "en" ? "Ambulatory health care services" : "Services de soins de santé ambulatoires";

		} else if (type === "artist"){
			return locale === "en" ? "Artist" : "Artiste";

		} else if (type === "art or cultural centre"){
			return locale === "en" ? "Art or Cultural Centre" : "Centre des arts ou de culture";

		} else if (type === "festival site"){
			return locale === "en" ? "Festival Site" : "Site de festival";

		} else if (type === "gallery"){
			return locale === "en" ? "Gallery" : "Galerie";

		} else if (type === "heritage or historic site"){
			return locale === "en" ? "Heritage or Historic Site" : "Site patrimonial ou historique";

		} else if (type === "library or archives"){
			return locale === "en" ? "Library or Archives" : "Bibliothèque ou Archives";

		} else if (type === "museum"){
			return locale === "en" ? "Museum" : "Musée";

		} else if (type === "theatre/performance and concert hall"){
			return locale === "en" ? "Theatres/Performance and Concert Hall" : "Théâtres/salles de spectacle et salles de concert";

		} else if (type === "miscellaneous"){
			return locale === "en" ? "Miscellaneous" : "Divers";
		}
	}
}
