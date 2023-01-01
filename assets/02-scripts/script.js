import { Weather, Geocoding } from "./lib/index.js";

const inputField = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const searchHistoryList = document.getElementById("search-history-list");

searchButton.addEventListener("click", (event) => {
	event.preventDefault();

	// Make API Calls

	// Add to search history
	let listItem = document.createElement("li");
	listItem.classList.add("city", "text-center");
	listItem.innerText = inputField.value; //TODO: Update value to be a city if user inputs zipcode
	searchHistoryList.append(listItem);
});
