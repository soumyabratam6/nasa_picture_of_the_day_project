const apiKey = "LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a"; // NASA API key
const apiUrl = "https://api.nasa.gov/planetary/apod";

// Get elements from the DOM
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentImageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");

// Event listener for form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedDate = searchInput.value;
  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});

// Fetch and display the current image of the day when the page loads
window.addEventListener("load", () => {
  getCurrentImageOfTheDay();
  loadSearchHistory();
});

// Function to fetch the current image of the day
function getCurrentImageOfTheDay() {
  const url = `${apiUrl}?api_key=${apiKey}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayImage(data, true);
    })
    .catch((error) => console.error("Error fetching current image:", error));
}

// Function to fetch the image of the day for a selected date
function getImageOfTheDay(date) {
  const url = `${apiUrl}?date=${date}&api_key=${apiKey}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayImage(data, false);
      saveSearch(date);
      addSearchToHistory(date);
    })
    .catch((error) => console.error("Error fetching image:", error));
}

// Function to display the image and its details in the UI
function displayImage(data, isCurrentDay) {
  let mediaElement;
  if (data.media_type === "video") {
    mediaElement = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    mediaElement = `<img src="${data.url}" alt="${data.title}">`;
  }
  const title = isCurrentDay
    ? "<h3>NASA Picture Of The Day</h3>"
    : `<h3>Picture On ${data.date}</h3>`;
  currentImageContainer.innerHTML = `
    <div class="media">
        ${title}
        ${mediaElement}
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    </div>
  `;
}

// Function to save a search date to local storage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// Function to load search history from local storage and display it
function loadSearchHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach((date) => addSearchToHistory(date));
}

// Function to add a search date to the search history list in the UI
function addSearchToHistory(date) {
  const listItem = document.createElement("li");
  listItem.textContent = date;
  listItem.addEventListener("click", () => {
    getImageOfTheDay(date);
  });
  searchHistoryList.appendChild(listItem);
}
