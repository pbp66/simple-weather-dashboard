import API from "./api";

class Geocoding extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/geo/1.0/direct",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}

	getCoordinatesByLocationName(city, countryCode, state = null) {
		if (state) {
			this.setSearchParameters({
				q: `${city},${state},${countryCode}`,
				appid: this.getApiKey(),
			});
		} else {
			this.setSearchParameters({
				q: `${city},${countryCode}`,
				appid: this.getApiKey(),
			});
		}
	}

	getCoordinatesByZipCode(zipCode, countryCode) {
		this.setSearchParameters({
			q: `${zipCode},${countryCode}`,
			appid: this.getApiKey(),
		});
	}

	async getCoordinates() {
		return await fetch(this.url);
	}
}

export default Geocoding;
