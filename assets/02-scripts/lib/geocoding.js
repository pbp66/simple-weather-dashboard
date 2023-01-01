import API from "./api.js";

class Geocoding extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/geo/1.0",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}

	async getCoordinatesByLocationName(city, countryCode = null, state = null) {
		if (state && countryCode) {
			this.setSearchParameters({
				q: `${city},${state},${countryCode}`,
				limit: 1,
				appid: this.getApiKey(),
			});
		} else if (!state) {
			this.setSearchParameters({
				q: `${city},${countryCode}`,
				limit: 1,
				appid: this.getApiKey(),
			});
		} else if (!countryCode) {
			this.setSearchParameters({
				q: `${city},${state}`,
				limit: 1,
				appid: this.getApiKey(),
			});
		} else {
			this.setSearchParameters({
				q: city,
				limit: 1,
				appid: this.getApiKey(),
			});
		}

		this.url.pathname += "/direct";
		let response = await this.getCoordinates();
		this.resetURL();
		return response[0];
	}

	async getCoordinatesByZipCode(zipCode, countryCode) {
		this.setSearchParameters({
			zip: `${zipCode},${countryCode}`,
			appid: this.getApiKey(),
		});

		this.url.pathname += "/zip";
		const response = await this.getCoordinates();
		this.resetURL();
		return response;
	}

	async getCoordinates() {
		const response = await fetch(this.url);
		if (response.ok) {
			return response.json();
		} else {
			return null;
		}
	}
}

export default Geocoding;
