import { Weather, Geocoding } from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const searchHistoryList = document.getElementById("search-history-list");

searchButton.addEventListener("click", (event) => {
	event.preventDefault();

	// Make API Calls

	// Add to search history
	addToSearchHistory(inputField.value);
});

function addToSearchHistory(locationObject) {
	const buttonElement = document.createElement("button");
	buttonElement.classList.add("previous-entry", "btn", "btn-secondary");
	buttonElement.value = locationObject; // TODO: Change to stringified object with lat and lon
	buttonElement.innerText = locationObject; // TODO: Change to City Name

	const listItem = document.createElement("li");
	listItem.classList.add("city", "text-center");
	listItem.appendChild(buttonElement);
	searchHistoryList.append(listItem);
}
