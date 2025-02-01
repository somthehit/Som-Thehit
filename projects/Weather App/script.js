// OpenWeatherMap API configuration
const API_KEY = '02c465fcb349b29b0bf5e4bba17a625d'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric';

// DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const cityElement = document.querySelector('.city');
const tempElement = document.querySelector('.temp');
const weatherIcon = document.querySelector('.weather-icon');
const descriptionElement = document.querySelector('.description');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');
const forecastContainer = document.querySelector('.forecast-container');

// Event listeners
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Fetch current weather data
async function getWeatherData(city) {
    const apiKey = API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        // Get timezone offset from the API response (in seconds)
        const timezoneOffset = weatherData.timezone;
        
        // Update time display
        updateCityTime(timezoneOffset);

        // Rest of your existing weather data display code
        cityElement.textContent = `Weather in ${weatherData.name}`;
        tempElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        descriptionElement.textContent = weatherData.weather[0].description;
        humidityElement.textContent = `Humidity: ${weatherData.main.humidity}%`;
        windElement.textContent = `Wind Speed: ${weatherData.wind.speed} km/h`;

        displayForecast(forecastData);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the weather data.');
    }
}

function updateCityTime(timezoneOffset) {
    try {
        // Create a date object for the current time
        const now = new Date();
        
        // Convert timezone offset from seconds to milliseconds
        const localTime = now.getTime();
        const localOffset = now.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const cityTime = new Date(utc + (timezoneOffset * 1000));

        // Format the time
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        
        const timeString = cityTime.toLocaleTimeString('en-US', timeOptions);
        document.querySelector('.time').textContent = `Current Time: ${timeString}`;
    } catch (error) {
        console.error('Error updating time:', error);
        document.querySelector('.time').textContent = 'Current Time: --:--';
    }
}

// Display current weather
function displayCurrentWeather(data) {
    cityElement.textContent = `Weather in ${data.name}`;
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windElement.textContent = `Wind Speed: ${data.wind.speed} km/h`;
}

// Display 5-day forecast
function displayForecast(data) {
    forecastContainer.innerHTML = '';
    
    // Get one forecast per day (every 8th item as the API returns data every 3 hours)
    const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <div class="forecast-date">${day}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="weather icon">
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-description">${forecast.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}