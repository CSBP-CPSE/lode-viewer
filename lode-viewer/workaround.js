import Core from '../basic-tools/tools/core.js';

export default class Workaround {
	
	// TODO : This probably won't work for other databases unless they keep the same field namespaceURI
	// It's a workaround for the ODHF because there are still some issues with the data at the time of launch
	static FixField(field, value) {
		if (field == "province") return this.LookupProvince(value, Core.locale);
		
		if (field == "odhf_facility_type") return this.LookupType(value, Core.locale);
		
		if (field == "postal_code") return value.replace(" ", "&nbsp");
		
		if (field =="facility_name") return value.charAt(0).toUpperCase() + value.slice(1);
		
		if (field =="street_name") return value.charAt(0).toUpperCase() + value.slice(1);
		
		if (field =="city") return value.charAt(0).toUpperCase() + value.slice(1);
		
		return value;
	}
	
	static LookupProvince(abbr, locale) {
		abbr = abbr.trim();	// Hidden whitespace character at the end, weird.
		
		if (abbr == 'nl') return locale == "en" ? "Newfoundland and Labrador" : "Terre-Neuve-et-Labrador";
		if (abbr == 'pe') return locale == "en" ? "Prince Edward Island" : "Île-du-Prince-Édouard";
		if (abbr == 'ns') return locale == "en" ? "Nova Scotia" : "Nouvelle-Écosse";
		if (abbr == 'nb') return locale == "en" ? "New Brunswick" : "Nouveau-Brunswick";
		if (abbr == 'qc') return locale == "en" ? "Quebec" : "Québec";
		if (abbr == 'on') return locale == "en" ? "Ontario" : "Ontario";
		if (abbr == 'mb') return locale == "en" ? "Manitoba" : "Manitoba";
		if (abbr == 'sk') return locale == "en" ? "Saskatchewan" : "Saskatchewan";
		if (abbr == 'ab') return locale == "en" ? "Alberta" : "Alberta";
		if (abbr == 'bc') return locale == "en" ? "British Columbia" : "Colombie-Britannique";
		if (abbr == 'yt') return locale == "en" ? "Yukon" : "Yukon";
		if (abbr == 'nt') return locale == "en" ? "Northwest Territories" : "Territoires du Nord-Ouest";
		if (abbr == 'nu') return locale == "en" ? "Nunavut" : "Nunavut";
	}
	
	static LookupType(type, locale) {		
		if (type == "Hospitals") {
			return locale == "en" ? "Hospitals" : "Hôpitaux";
		}
		
		if (type == "Nursing and residential care facilities"){
			return locale == "en" ? "Nursing and residential care facilities" : "Établissements de soins infirmiers et de soins pour bénéficiaires internes";
		}
		
		if (type == "Ambulatory health care services"){
			return locale == "en" ? "Ambulatory health care services" : "Services de soins de santé ambulatoires";
		}
	}
}