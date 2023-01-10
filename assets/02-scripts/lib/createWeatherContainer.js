export default function createWeatherContainer() {
	const currentWeatherCard = document.createElement("div");
	currentWeatherCard.classList.add("card", "bg-light-custom");
	currentWeatherCard.id = "current-weather-card";
	currentWeatherCard.appendChild(createCardBody());

	const currentWeather = document.createElement("div");
	currentWeather.classList.add("container-fluid");
	currentWeather.id = "current-weather";
	currentWeather.appendChild(currentWeatherCard);

	const weather = document.createElement("article");
	weather.appendChild(currentWeather);
	weather.appendChild(createForecastContainer());

	return weather;
}

function createCardBody() {
	const cardBody = document.createElement("div");
	cardBody.classList.add("card-body", "current-weather-card");
	cardBody.appendChild(createCardTitle());
	cardBody.appendChild(createCardText());
	return cardBody;
}

function createCardTitle() {
	const cardSubtitle = document.createElement("h6");
	cardSubtitle.classList.add("card-subtitle");
	cardSubtitle.id = "current-weather-date";

	const cardTitle = document.createElement("h4");
	cardTitle.classList.add("card-title");
	cardTitle.id = "current-weather-title";

	const titleBar = document.createElement("div");
	titleBar.classList.add("container-fluid", "title-bar");
	titleBar.appendChild(cardSubtitle);
	titleBar.appendChild(cardTitle);

	return titleBar;
}

function createCardText() {
	const cardText = document.createElement("p");
	cardText.classList.add("card-text");
	cardText.id = "current-weather.text";
	return cardText;
}

function createForecastContainer() {
	const forecastCardContainer = document.createElement("div");
	forecastCardContainer.classList.add("cards", "row");
	forecastCardContainer.id = "forecast-cards-container";

	const forecastCardTitle = document.createElement("h3");
	forecastCardTitle.innerText = "5-Day Forecast:";

	const forecastContainer = document.createElement("div");
	forecastContainer.classList.add("container-fluid", "bg-light-custom");
	forecastContainer.appendChild(forecastCardTitle, forecastCardContainer);

	return forecastContainer;
}
