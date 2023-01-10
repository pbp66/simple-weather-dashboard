// TODO: Hide Current weather and forecast when no data is displayed.
// TODO: Change background based on weather type.
// TODO: Final stylistic changes.

import { Weather, Geocoding, stateNameToAbbreviation } from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const searchHistoryList = document.getElementById("search-history-list");
const currentWeatherDate = document.getElementById("current-weather-date");
const currentWeatherCity = document.getElementById("current-weather-title");
const currentWeatherText = document.getElementById("current-weather-text");
const forecastCards = document.getElementById("forecast-cards-container");

const geocodingAPI = new Geocoding();
const weatherAPI = new Weather();
const searchHistory = [];

function addToSearchHistory(latitude, longitude, location) {
	if (!searchHistory.includes(location)) {
		// Create previous search button entry
		const buttonElement = document.createElement("button");
		buttonElement.classList.add("previous-entry", "btn", "btn-secondary");
		buttonElement.value = JSON.stringify({ lat: latitude, lon: longitude });
		buttonElement.innerText = location;
		buttonElement.addEventListener("click", search);

		// Add search button to the list
		const listItem = document.createElement("li");
		listItem.classList.add("city", "text-center");
		listItem.appendChild(buttonElement);

		// Add list item to the list
		searchHistoryList.append(listItem);

		// Set the max history limit to 10 entries. If more than 10 entires, remove the oldest entry
		if (searchHistory.length >= 10) {
			searchHistory.shift();
		}
		searchHistory.push(location);
	}
}

async function fetchCurrentWeather(latitude, longitude) {
	return await weatherAPI.getCurrentWeather(latitude, longitude);
}

async function fetchForecast(latitude, longitude) {
	return await weatherAPI.getExtendedForecast(5, latitude, longitude);
}

async function fetchCoordinates(location) {
	return await geocodingAPI.findByLocation(location);
}

function parseSearchInput(inputString) {
	const location = {};

	// Separates entries by commas. If no commas are provided, the fetch request will give a 404 response
	const inputValues = inputString.split(",").map((element) => element.trim());

	for (const item of inputValues) {
		// Check if it contains a zipCode. Note, if the user enters multiple zip codes, only the last one will be taken.
		if (parseInt(item, 10)) {
			// All uses zip codes are 5 digits long. This does not work with the extended zip code format
			if (item.length === 5) {
				location.zipCode = parseInt(item, 10);
			}
		} else if (item.length === 2) {
			location.state = item;
			// Check if the element is composed of lower case, upper case, and spaces
		} else if (/^[a-z A-Z]+$/.test(item)) {
			location.city = item;
		}
	}

	return location;
}

function addCurrentWeatherContent(currentWeather, geoLocation) {
	currentWeatherDate.innerHTML = "";
	currentWeatherCity.innerHTML = "";
	currentWeatherText.innerHTML = "";
	const { name, state } = geoLocation;

	currentWeatherDate.innerText =
		currentWeather.dateTime.toFormat("LL/dd/yyyy hh:mm a");
	currentWeatherCity.innerText = `${name}, ${stateNameToAbbreviation(state)}`;
	const weatherIcon = document.createElement("img");
	weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
	currentWeatherCity.appendChild(weatherIcon);

	let currentSpan;
	const keySkipList = ["dateTime", "icon", "weatherId", "weather"];
	for (const weatherObjectKey in currentWeather) {
		if (keySkipList.includes(weatherObjectKey)) {
			continue;
		} else if (currentWeather[weatherObjectKey] instanceof Object) {
			continue;
		} else if (currentWeather[weatherObjectKey] == null) {
			continue;
		}
		currentSpan = document.createElement("span");
		currentSpan.id = weatherObjectKey;
		currentSpan.innerText = `${weatherObjectKey}: ${currentWeather[weatherObjectKey]}`;

		currentWeatherText.appendChild(currentSpan);
		currentWeatherText.appendChild(document.createElement("br"));
	}
}

function addForecastWeatherContent(forecastWeather, geoLocation) {
	forecastCards.innerHTML = "";
	for (let i = 0; i < forecastWeather.length; i++) {
		// Default Card Creation
		let card = document.createElement("div");
		card.classList.add(
			"card",
			"col",
			"forecast-card",
			"bg-dark",
			"text-light"
		);
		card.id = forecastWeather[i].dateTime.toFormat("yyyy/LL/dd");

		// Adding card title
		let cardTitle = document.createElement("h5");
		cardTitle.innerText =
			forecastWeather[i].dateTime.toFormat("LL/dd/yyyy");
		card.appendChild(cardTitle);

		// Adding card content
		let content = document.createElement("p");
		let highTemp = document.createElement("span");
		highTemp.innerText = forecastWeather[i].highTemp;
		content.appendChild(highTemp);
		content.appendChild(document.createElement("br"));

		let lowTemp = document.createElement("span");
		lowTemp.innerText = forecastWeather[i].lowTemp;
		content.appendChild(lowTemp);
		content.appendChild(document.createElement("br"));

		let feelsLikeTemp = document.createElement("span");
		feelsLikeTemp.innerText = forecastWeather[i].feelsLikeTemp;
		content.appendChild(feelsLikeTemp);
		content.appendChild(document.createElement("br"));

		let humidity = document.createElement("span");
		humidity.innerText = forecastWeather[i].humidity;
		content.appendChild(humidity);

		card.appendChild(content);
		forecastCards.appendChild(card);
	}
}

async function search(event) {
	event.preventDefault();

	let geoLocation;
	let currentWeather;
	let forecast;

	if (event.target.id === "search-button") {
		try {
			const location = parseSearchInput(inputField.value);
			geoLocation = await fetchCoordinates(location);
			if (!geoLocation) {
				throw new Error("Bad Input Error");
			}
		} catch (err) {
			alert("Improper input");
			return;
		}
	} else if (event.target.classList.contains("previous-entry")) {
		const coordinates = JSON.parse(event.target.value);
		geoLocation = await geocodingAPI.getLocationInformation(
			coordinates.lat,
			coordinates.lon
		);
	}

	const { lat: latitude, lon: longitude, name, state } = geoLocation;

	try {
		currentWeather = await fetchCurrentWeather(latitude, longitude);
		forecast = await fetchForecast(latitude, longitude);
	} catch (err) {
		console.error(err);
		return;
	}

	addCurrentWeatherContent(currentWeather, geoLocation);
	addForecastWeatherContent(forecast, geoLocation);
	addToSearchHistory(
		latitude,
		longitude,
		`${name}, ${stateNameToAbbreviation(state)}`
	);
}

searchButton.addEventListener("click", await search);
