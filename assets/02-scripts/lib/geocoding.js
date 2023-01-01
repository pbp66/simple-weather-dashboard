import API from "./api";

class Geocoding extends API {
	constructor() {
		super(
			"http://api.openweathermap.org/geo/1.0/direct",
			"1b3bacfd2da20311ada4894fff0d35e8"
		);
	}

	async getCoordinatesByLocationName(city, countryCode = null, state = null) {
		if (state && countryCode) {
			this.setSearchParameters({
				q: `${city},${state},${countryCode}`,
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
				appid: this.getApiKey(),
			});
		} else {
			this.setSearchParameters({
				q: city,
				limit: 1,
				appid: this.getApiKey(),
			});
		}

		let response = await this.getCoordinates();
		const { lat: latitude, lon: longitude } = response;

		return { latitude, longitude };
	}

	async getCoordinatesByZipCode(zipCode, countryCode) {
		this.setSearchParameters({
			q: `${zipCode},${countryCode}`,
			appid: this.getApiKey(),
		});

		const response = await this.getCoordinates();
		const { lat: latitude, lon: longitude } = response;
		return { latitude, longitude };
	}

	async getCoordinates() {
		return (await fetch(this.url)).json();
	}
}

export default Geocoding;
