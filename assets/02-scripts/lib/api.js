/**
 * Base class for implementing an API
 */

class API {
	#defaultURL;
	#API_KEY;
	constructor(baseURL, apiKey = null) {
		this.url = new URL(baseURL);
		this.setDefaultURL(baseURL);
		if (apiKey) {
			this.setApiKey(apiKey);
		}
	}

	setDefaultURL(url) {
		this.#defaultURL = new URL(url);
	}

	getDefaultURL() {
		return this.#defaultURL;
	}

	setApiKey(key) {
		this.#API_KEY = key;
	}

	getApiKey() {
		return this.#API_KEY;
	}

	resetURL() {
		this.url = new URL(this.#defaultURL);
	}

	setSearchParameters(parameterObject) {
		this.resetURL();
		let keys = Object.keys(parameterObject);
		for (const key of keys) {
			this.url.searchParams.append(key, parameterObject[key]);
		}
	}
}

export default API;
