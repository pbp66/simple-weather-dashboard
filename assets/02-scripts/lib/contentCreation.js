import stateNameToAbbreviation from "./states.js";
import createWeatherContainer from "./createWeatherContainer.js";

function clearCurrentWeatherContent() {
	let currentWeatherDate = document.getElementById("current-weather-date");
	let currentWeatherCity = document.getElementById("current-weather-title");
	let currentWeatherText = document.getElementById("current-weather-text");
	currentWeatherDate.innerHTML = "";
	currentWeatherCity.innerHTML = "";
	currentWeatherText.innerHTML = "";
}

function addForecastWeatherContent(forecastWeather, geoLocation) {
	const forecastCards = document.getElementById("forecast-cards-container");
	forecastCards.innerHTML = "";
	for (const weather in forecastWeather) {
		// Default Card Creation
		let card = document.createElement("div");
		card.classList.add(
			"card",
			"col",
			"forecast-card",
			//"bg-dark",
			"bg-secondary",
			"text-light"
		);
		card.id = weather;

		// Adding card title
		const weatherIcon = document.createElement("img");
		weatherIcon.src = `http://openweathermap.org/img/wn/${forecastWeather[weather].icon}@2x.png`;
		let cardTitle = document.createElement("h5");
		cardTitle.innerText = weather;
		cardTitle.appendChild(weatherIcon);
		card.appendChild(cardTitle);

		// Adding card content
		let content = document.createElement("p");
		let temp = document.createElement("span");
		temp.innerText = `${forecastWeather[weather].highTemp}\u2109 / ${forecastWeather[weather].lowTemp}\u2109`;
		content.appendChild(temp);
		content.appendChild(document.createElement("br"));

		let pressure = document.createElement("span");
		pressure.innerText = `${forecastWeather[weather].pressure} inHg`;
		content.appendChild(pressure);
		content.appendChild(document.createElement("br"));

		let humidity = document.createElement("span");
		humidity.innerText = `${forecastWeather[weather].humidity}% Humidity`;
		content.appendChild(humidity);

		card.appendChild(content);
		forecastCards.appendChild(card);
	}
}

function addCurrentWeatherContent(currentWeather, geoLocation) {
	let currentWeatherDate, currentWeatherCity, currentWeatherText;
	const { name, state } = geoLocation;
	let currentWeatherContainer = document.getElementById("current-weather");
	if (!currentWeatherContainer) {
		const main = document.getElementById("main");
		main.appendChild(createWeatherContainer());
	}

	currentWeatherDate = document.getElementById("current-weather-date");
	currentWeatherCity = document.getElementById("current-weather-title");
	currentWeatherText = document.getElementById("current-weather-text");
	clearCurrentWeatherContent();

	// Update Current Weather Header
	currentWeatherDate.innerText =
		currentWeather.dateTime.toFormat("LL/dd/yyyy hh:mm a");
	currentWeatherCity.innerText = `${name}, ${stateNameToAbbreviation(state)}`;

	// Creating weather icon
	const weatherIcon = document.createElement("img");
	weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
	weatherIcon.id = "weather-icon";
	weatherIcon.width = "100";

	const weatherIconContainer = document.getElementById(
		"weather-icon-container"
	);
	weatherIconContainer.appendChild(weatherIcon);

	// Update Current Weather Information
	const currentTemperature = document.getElementById("current-temperature");
	currentTemperature.innerText = `${currentWeather.temperature}\u2109`;

	const weatherDescription = document.getElementById("weather-description");
	weatherDescription.innerText = `${currentWeather.description}`;

	const feelsLike = document.getElementById("feels-like");
	feelsLike.innerText = `Feels like ${currentWeather.feelsLikeTemp}\u2109`;

	addSecondRowContent(
		"high-low",
		`${currentWeather.highTemp}\u2109 / ${currentWeather.lowTemp}\u2109`
	);

	addSecondRowContent(
		"wind",
		`${currentWeather.windSpeed} mph ${currentWeather.windDirection}`
	);
	addSecondRowContent("pressure", `${currentWeather.pressure} in`);
	addSecondRowContent("humidity", `${currentWeather.humidity}%`);
	addSecondRowContent("visibility", `${currentWeather.visibility} miles`);
}

function addSecondRowContent(parentContainerId, text) {
	const paragraph = document.createElement("p");
	paragraph.innerText = text;

	const container = document.getElementById(parentContainerId);
	container.appendChild(paragraph);
}

export {
	clearCurrentWeatherContent,
	createWeatherContainer,
	addForecastWeatherContent,
	addCurrentWeatherContent,
};
