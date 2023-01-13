import {
	Weather,
	Geocoding,
	stateNameToAbbreviation,
	addForecastWeatherContent,
	addCurrentWeatherContent,
} from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const geocodingAPI = new Geocoding();
const weatherAPI = new Weather();

const searchHistory = [];
const searchHistoryList = document.getElementById("search-history-list");
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
			localStorage.removeItem(searchHistory[0]);
			searchHistory.shift();
			searchHistoryList.removeChild(
				searchHistoryList.getElementsByTagName("li")[0]
			);
		}
		searchHistory.push(location);
		localStorage.setItem(
			location,
			JSON.stringify({ lat: latitude, lon: longitude })
		);
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

async function search(event) {
	event.preventDefault();

	let geoLocation;
	let currentWeather;
	let forecast;

	// Handle behavior for when the search button is clicked vs a previous entry
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
	} else {
		console.error(
			"The clicked element does not have a proper class or id associated with it to handle click events"
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
	updateWeatherBackground(
		currentWeather.weather[0].main,
		currentWeather.icon
	);
	addCurrentWeatherContent(currentWeather, geoLocation);
	addForecastWeatherContent(forecast);
	addToSearchHistory(
		latitude,
		longitude,
		`${name}, ${stateNameToAbbreviation(state)}`
	);
}

function updateWeatherBackground(category, icon) {
	const footer = document.getElementsByTagName("footer")[0];
	footer.innerHTML = "";
	category = category.toLowerCase();
	let urlPath = "";
	let footerContent;

	switch (category) {
		case "thunderstorm":
			urlPath = "../assets/03-images/storming-min.jpg";
			footerContent = createFooter(
				"storming",
				"https://pixabay.com/users/felixmittermeier-4397258/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3441687",
				"PayPal.me/FelixMittermeier from PixaBay"
			);
			break;
		case "drizzle":
			urlPath = "../assets/03-images/drizzle-min.jpg";
			footerContent = createFooter(
				"drizzle",
				"https://www.freepik.com/free-photo/water-texture-background-rainy-window-cloudy-day_18998865.htm#query=rain&position=14&from_view=search&track=sph",
				"rawpixel.com on Freepik"
			);
			break;
		case "rain":
			urlPath = "../assets/03-images/rain-min.jpg";
			footerContent = createFooter(
				"rain",
				"https://www.freepik.com/free-photo/rain-outside-windows-villa_2441313.htm#query=rain&position=1&from_view=search&track=sph",
				"Kireyonok_Yuliya on Freepik"
			);
			break;
		case "snow":
			urlPath = "../assets/03-images/snowy-weather-min.jpg";
			footerContent = createFooter(
				"snow",
				"https://www.freepik.com/premium-photo/snow-black-background-snowflakes-overlay-snow-background_26757657.htm",
				"alexkich on Freepick"
			);
			break;
		case "clear":
			urlPath = "../assets/03-images/clear-sky-min.jpg";
			footerContent = createFooter(
				"clear-sky",
				"https://www.pexels.com/photo/blue-sky-96622/",
				"PhotoMIX Company"
			);
			break;
		case "clouds":
			const iconStringArray = icon.split("");
			const newIcon = iconStringArray[0] + iconStringArray[1];
			switch (newIcon) {
				case "02":
					urlPath = "../assets/03-images/few-clouds-min.jpg";
					footerContent = createFooter(
						"few-clouds",
						"https://www.freepik.com/free-photo/blue-sky-with-clouds_985381.htm#query=cloudy&from_query=partly%20cloudy&position=29&from_view=search&track=sph",
						"jannoon028 on Freepik"
					);
					break;
				case "03":
					urlPath = "../assets/03-images/partly-cloudy-min.jpg";
					footerContent = createFooter(
						"partly-cloudy",
						"https://www.pexels.com/photo/clouds-landscape-photography-531972/",
						"Pixabay"
					);
					break;
				case "04":
					urlPath = "../assets/03-images/cloudy-min.jpg";
					footerContent = createFooter(
						"mostly-cloudy",
						"https://www.freepik.com/free-photo/cloudy-sky-landscape-wallpaper_19380999.htm#query=grey%20cloudy%20sky&position=4&from_view=keyword",
						"Freepik"
					);
					break;
				default:
					// For errors, use the clear sky background
					urlPath = "../assets/03-images/clear-sky-min.jpg";
					footerContent = createFooter(
						"clear-sky",
						"https://www.pexels.com/photo/blue-sky-96622/",
						"PhotoMIX Company"
					);
			}
			break;
		default:
			// Atmospheric conditions
			if (category === "tornado") {
				urlPath = "../03-images/tornado-min.jpg";
				footerContent = createFooter(
					"tornado",
					"https://www.pexels.com/photo/lightning-and-tornado-hitting-village-1446076/",
					"Ralph W. Lambrecht"
				);
			} else {
				urlPath = "../assets/03-images/windy-min.jpg";
				footerContent = createFooter(
					"windy",
					"https://unsplash.com/@hvranic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
					"Ivan Vranić on Unsplash"
				);
			}
	}

	const body = document.getElementsByTagName("body")[0];
	body.style.backgroundImage = `url(${urlPath})`;
	footer.appendChild(footerContent);
}

function createFooter(id, href, hrefInnerText) {
	let footerContent = document.createElement("div");
	footerContent.classList.add("footer-content");
	footerContent.id = id;
	footerContent.innerText = "Background Image by ";
	const attributionLink = document.createElement("a");
	attributionLink.classList.add("link-warning");
	attributionLink.href = href;
	attributionLink.innerText = hrefInnerText;
	footerContent.appendChild(attributionLink);
	return footerContent;
}

searchButton.addEventListener("click", search);
