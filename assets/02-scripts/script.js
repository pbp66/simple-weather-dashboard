import { Weather, Geocoding } from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const searchHistoryList = document.getElementById("search-history-list");

const geocodingAPI = new Geocoding();
const weatherAPI = new Weather();

function addToSearchHistory(latitude, longitude, location) {
	const buttonElement = document.createElement("button");
	buttonElement.classList.add("previous-entry", "btn", "btn-secondary");
	buttonElement.value = `{lat: ${latitude}, lon: ${longitude}}`;
	buttonElement.innerText = location; // TODO: Change to City Name

	const listItem = document.createElement("li");
	listItem.classList.add("city", "text-center");
	listItem.appendChild(buttonElement);
	searchHistoryList.append(listItem);
}

function search(latitude, longitude) {}

async function parseSearchInput(inputString) {
	let latitude, longitude;
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
		} else if (/^[a-zA-Z]+$/.test(item)) {
			location.city = item;
		}
	}

	let response;
	if (location.zipCode == null) {
		if (location.state == null) {
			response = await geocodingAPI.getCoordinatesByLocationName(
				location.city
			);
		} else {
			response = await geocodingAPI.getCoordinatesByLocationName(
				location.city,
				"US",
				location.state
			);
		}
	} else {
		response = await geocodingAPI.getCoordinatesByZipCode(
			location.zipCode,
			"US"
		);
	}
	if (!(await response)) {
		return null;
	} else {
		return response;
	}
}

searchButton.addEventListener("click", async (event) => {
	event.preventDefault();
	try {
		const locationObject = await parseSearchInput(inputField.value);
		console.log(locationObject);
		if (!locationObject) {
			throw new Error("Bad Input Error");
		}
	} catch (err) {
		alert("Improper input");
		return;
	}

	// Make API Calls

	// Add to search history
	addToSearchHistory(0, 0, inputField.value);
});
