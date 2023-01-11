export default function createWeatherContainer() {
	const currentWeatherCard = document.createElement("div");
	currentWeatherCard.classList.add(
		"card",
		"bg-secondary-custom",
		"text-light"
	);
	currentWeatherCard.id = "current-weather-card";
	currentWeatherCard.appendChild(createCardBody());

	const currentWeather = document.createElement("div");
	currentWeather.classList.add("container-fluid");
	currentWeather.id = "current-weather";
	currentWeather.appendChild(currentWeatherCard);

	const weather = document.createElement("article");
	weather.classList.add("container-fluid", "col-6");
	weather.id = "weather";
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
	const firstRow = document.createElement("div");
	firstRow.classList.add("container-fluid");
	firstRow.id = "first-row";
	firstRow = createFirstRow();

	const secondRow = document.createElement("div");
	secondRow.classList.add("container-fluid");
	secondRow.id = "second-row";
	secondRow = createSecondRow();

	const cardText = document.createElement("div");
	cardText.classList.add("card-text");
	cardText.id = "current-weather-text";
	cardText.appendChild(firstRow);
	cardText.appendChild(secondRow);

	return cardText;
}

function createForecastContainer() {
	const forecastCardContainer = document.createElement("div");
	forecastCardContainer.classList.add("cards", "row");
	forecastCardContainer.id = "forecast-cards-container";
	const forecastContainer = document.createElement("div");
	forecastContainer.classList.add("container-fluid");
	forecastContainer.id = "forecast";
	forecastContainer.appendChild(forecastCardContainer);

	return forecastContainer;
}

function createFirstRow() {
	const imageContainer = document.createElement("div");
	imageContainer.classList.add("card-image");
	imageContainer.id = "weather-icon-container";

	const currentTemperature = document.createElement("p");
	currentTemperature.id = "current-temperature";

	const currentTemperatureContainer = document.createElement("div");
	currentTemperatureContainer.classList.add("current-weather-subset");
	currentTemperatureContainer.id = "current-temperature-container";
	currentTemperatureContainer.appendChild(currentTemperature);

	const weatherDescription = document.createElement("p");
	weatherDescription.id = "weather-description";
	const feelsLike = document.createElement("p");
	feelsLike.id = "feels-like";

	const weatherDescriptionContainer = document.createElement("div");
	weatherDescriptionContainer.classList.add("current-weather-subset");
	weatherDescriptionContainer.id = "weather-description-container";
	weatherDescriptionContainer.appendChild(weatherDescription);
	weatherDescriptionContainer.appendChild(feelsLike);

	const firstRow = document.createElement("div");
	firstRow.classList.add("container-fluid");
	firstRow.id = "first-row";

	firstRow.appendChild(imageContainer);
	firstRow.appendChild(currentTemperatureContainer);
	firstRow.appendChild(weatherDescriptionContainer);

	return firstRow;
}

function createSecondRow() {
	const secondRow = document.createElement("div");
	secondRow.classList.add("container-fluid", "row");
	secondRow.id = "second-row";

	secondRow.appendChild(createSecondRowContainer("high-low", "High / Low"));
	secondRow.appendChild(createSecondRowContainer("wind", "Wind"));
	secondRow.appendChild(createSecondRowContainer("pressure", "Pressure"));
	secondRow.appendChild(createSecondRowContainer("humidity", "Humidity"));
	secondRow.appendChild(createSecondRowContainer("visibility", "Visibility"));

	return secondRow;
}

function createSecondRowContainer(id, title) {
	const titleEl = document.createElement("h6");
	titleEl.innerText = title;

	const container = document.createElement("div");
	container.classList.add("col", "bg-light-custom", "text-dark");
	container.id = id;
	container.appendChild(titleEl);

	return container;
}
