function clearCurrentWeatherContent() {
	currentWeatherDate.innerHTML = "";
	currentWeatherCity.innerHTML = "";
	currentWeatherText.innerHTML = "";
}

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

function createWeatherContainer() {
	let weatherElements = {};

	const weather = document.createElement("article");
	const currentWeather = document.createElement("div");
	const currentWeatherCard = document.createElement("div");
	const cardBody = document.createElement("div");
	const titleBar = document.createElement("div");
	const forecastContainer = document.createElement("div");
	const forecastCardContainer = document.createElement("div");

	const cardSubtitle= document.createElement("h6");
	const cardTitle= document.createElement("h4");
	const cardText= document.createElement("p");
	const forecastCardTitle= document.createElement("h3");

	return weatherElements;
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

function addCurrentWeatherContent(currentWeather, geoLocation) {
	let currentWeatherDate, currentWeatherCity, currentWeatherText;
	const { name, state } = geoLocation;
	const currentWeatherContainer = document.getElementById("current-weather");
	if (!currentWeatherContainer) {
		createWeatherContainer();
	} else {
		currentWeatherDate = document.getElementById("current-weather-date");
		currentWeatherCity = document.getElementById("current-weather-title");
		currentWeatherText = document.getElementById("current-weather-text");
	}

	// Update Current Weather Header
	clearCurrentWeatherContent();
	currentWeatherDate.innerText =
		currentWeather.dateTime.toFormat("LL/dd/yyyy hh:mm a");
	currentWeatherCity.innerText = `${name}, ${stateNameToAbbreviation(state)}`;
	const weatherIcon = document.createElement("img");
	weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
	currentWeatherCity.appendChild(weatherIcon);

	// Update Current Weather Information
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

export {
	clearCurrentWeatherContent,
	addToSearchHistory,
	createWeatherContainer,
	addForecastWeatherContent,
	addCurrentWeatherContent,
};
