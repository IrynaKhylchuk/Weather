const cityInput = document.getElementById('cityInput')
const getWeatherBtn = document.getElementById('getWeatherBtn')
getWeatherBtn.addEventListener('click', getWeather)

async function getWeather() {
    if (cityInput.value.length === 0) {
        cityInput.style.borderColor = 'red'
    } else {
        cityInput.style.borderColor = '#ccc'

        const cityName = cityInput.value
        const apiKey = '19f7e61a7328167f20735e3a709d5e7e'
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`

        displayWeatherForCity(forecastApiUrl)
    }
}

const displayWeatherForCity = async (url) => {
    try {
        const forecastResponse = await fetch(url)
        const forecastData = await forecastResponse.json()
        console.log('response -> ', forecastResponse)
        console.log('data -> ', forecastData)

        if (forecastResponse.status === 404) {
            cityInput.style.borderColor = 'red'
        }

        displayCurrentWeather(forecastData)
        displayAdditionalWeather(forecastData)
        displayForecastFor24H(forecastData)
        displayForecastFor5Days(forecastData)
    } catch (error) {
        console.error('Error:', error)
    }
}

function displayCurrentWeather(data) {
    const currentWeatherElement = document.getElementById('currentWeather')
    currentWeatherElement.innerHTML = ''

    currentWeatherElement.innerHTML = `
        <div class='mainWeatherData'>
            <div class='locationAndDate'>
                <h1>${data.city.country}, ${data.city.name}</h1>
                <p>as of ${data.list[0].dt_txt}</p>
            </div>
            <div class='weatherInfo'>
                <div class='mainBlockWeather'>
                    <p class='temperature'>${Math.round(data.list[0].main.temp)}<span>°C</span></p>
                    <p class='condition'>${capitalizeFirstLetter(data.list[0].weather[0].description)}</p>
                    <p>Day: ${Math.ceil(getMaxTemperature(data))}°C • Night: ${Math.floor(getMinTemperature(data))}°C</p>
                </div>
                <div class='icon'><img src='http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png'></div>
            </div>
        </div>
    `
}

function displayAdditionalWeather(data) {
    const additionalWeather = document.getElementById('additionalWeather')
    additionalWeather.innerHTML = ''

    let sunriseUnix = new Date(data.city.sunrise * 1000)
    let sunsetUnix = new Date(data.city.sunset * 1000)
    let sunriseHours = sunriseUnix.getHours()
    let sunriseMinutes = sunriseUnix.getMinutes()
    let sunsetHours = sunsetUnix.getHours()
    let sunsetMinutes = sunsetUnix.getMinutes()

    let sunrise = `${pad(sunriseHours)} : ${pad(sunriseMinutes)}`
    let sunset = `${pad(sunsetHours)} : ${pad(sunsetMinutes)}`

    additionalWeather.innerHTML = `
        <div class='additionalWeatherData'>
            <h3>Weather Today in ${data.city.country}, ${data.city.name}</h3>
            <div class='row'>
                <div class='col-6'>
                    <div class='feelsLike'>
                        <div>Feels Like</div>
                        <div>${Math.round(data.list[0].main.feels_like)}<span>°C</span></div>
                    </div>
                </div>
                <div class='col-6'>
                    <div class='weatherDetailsItem sunriseSunset'>
                        <div><img src='imgs/sunrise.png' alt='sunrise'/></div>
                        <div class='row'>
                            <div class='col-6'><i class='fa-solid fa-arrow-up'></i>${sunrise}</div>
                            <div class='col-6'><i class='fa-solid fa-arrow-down'></i>${sunset}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='row'>
                <div class='col-6'>
                    <div class='weatherDetailsItem'>
                        <div><i class='fa-solid fa-temperature-half'></i> High / Low</div>
                        <div>
                        ${Math.ceil(data.list[0].main.temp_max)}°C /
                        ${Math.floor(data.list[0].main.temp_min)}°C
                        </div>
                    </div>
                    <div class='weatherDetailsItem'>
                        <div><i class='fa-solid fa-droplet'></i> Humidity</div>
                        <div>${data.list[0].main.humidity} %</div>
                    </div>
                    <div class='weatherDetailsItem'>
                        <div><i class='fa-solid fa-arrow-down-long'></i> Pressure</div>
                        <div>${data.list[0].main.pressure} mb</div>
                    </div>
                </div>
                <div class='col-6'>
                    <div class='weatherDetailsItem'>
                        <div><i class='fa-solid fa-eye'></i> Visibility</div>
                        <div>${data.list[0].visibility} m</div>
                    </div>
                    <div class='weatherDetailsItem'>
                        <div><i class='fa-solid fa-wind'></i> Wind</div>
                        <div>${data.list[0].wind.speed} m/h</div>
                    </div>
                    <div class='weatherDetailsItem'>
                        <div><i class='fa-solid fa-cloud-showers-heavy'></i> POP</div>
                        <div>${data.list[0].pop} %</div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function displayForecastFor24H(data) {
    const forecastFor24H = document.getElementById('forecastFor24H')
    forecastFor24H.innerHTML = ''

    const forecastFor24HData = document.createElement('div')
    forecastFor24H.appendChild(forecastFor24HData)
    forecastFor24HData.classList.add('forecastFor24HData')
    forecastFor24HData.innerHTML = '<h3>24-hr Forecast</h3>'

    for (let i = 0; i < 9; i++) {
        let timeUnix = new Date(data.list[i].dt * 1000)
        let hours = timeUnix.getUTCHours()
        let minutes = timeUnix.getUTCMinutes()
        let time = `${pad(hours)} : ${pad(minutes)}`

        forecastFor24HData.innerHTML += `
            <div class='row'>
                <div class='col-3'>${time}</div>
                <div class='col-3'>${Math.round(data.list[i].main.temp)}°C</div>
                <div class='col-3'><img src='http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png'></div>
                <div class='col-3'>${data.list[i].pop} %</div>
            </div>
        `
    }
}

function displayForecastFor5Days(data) {
    const forecastElement = document.getElementById('forecastFor5Days')
    forecastElement.innerHTML = ''

    const forecastLine = document.createElement('div')
    forecastLine.classList.add('row', 'forecastLine')
    forecastElement.appendChild(forecastLine)

    const forecastData = data.list.filter((item, index) => index % 8 === 0)
    forecastData.forEach(forecast => {
        const date = new Date(forecast.dt * 1000)
        const condition = forecast.weather[0].main
        const icon = forecast.weather[0].icon

        let maxTemp = -Infinity
        let minTemp = Infinity

        for (let i = 0; i < 8; i++) {
            const temp = data.list[forecastData.indexOf(forecast) * 8 + i].main.temp

            maxTemp = Math.max(maxTemp, temp)
            minTemp = Math.min(minTemp, temp)
        }

        forecastLine.innerHTML += `
            <div class='forecastItem col'>
                <div class='weekday'><h4>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h4></div>
                <div class='date'>${date.toLocaleDateString('en-US', { day: 'numeric' } / { month: 'numeric' })}</div>
                <div class='weathyrInfo'>
                <div class='icon'><img src='http://openweathermap.org/img/wn/${icon}.png' alt='${condition}'></div>
                    <div class='temperature'>${Math.ceil(maxTemp)}°C / ${Math.floor(minTemp)}°C</div>
                </div>
            </div>
        `
    })
}

document.getElementById('dropdownBtn').addEventListener('click', () => {
    const dropdown = document.getElementsByClassName('dropdown')[0]
    dropdown.classList.toggle('active')
})

document.addEventListener('click', function (e) {
    const dropdowns = document.getElementsByClassName('dropdown')
    for (const openDropdown of dropdowns) {
        if (openDropdown.classList.contains('active') && !openDropdown.contains(e.target)) {
            openDropdown.classList.remove('active')
        }
    }
})

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function pad(number) {
    if (number < 10) {
        return '0' + number
    }
    return number
}

function getMaxTemperature(data) {
    const maxTempArr = []

    for (let i = 0; i < 9; i++) {
        maxTempArr.push(data.list[i].main.temp)
    }

    const maxTemp = Math.max(...maxTempArr)

    return maxTemp
}

function getMinTemperature(data) {
    const minTempArr = []

    for (let i = 0; i < 9; i++) {
        minTempArr.push(data.list[i].main.temp)
    }

    const minTemp = Math.min(...minTempArr)

    return minTemp
}