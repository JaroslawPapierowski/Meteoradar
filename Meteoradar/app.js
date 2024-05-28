function handleClick() {
    getWeather();
    getData();
    getFiveDayForecast();
  }

async function getData() {
    var city = document.getElementById("city").value;
    var data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=37fca7b8c7481bc5d2965c47965c6237&units=metric`);
    var json = await data.json();

    var currentCityText = document.getElementById("currentCityText");
    currentCityText.textContent = city.toUpperCase();

    if (json.main && json.main.temp) {
        document.getElementById("temperature").textContent = json.main.temp;
    } else {
        document.getElementById("temperature").textContent = "Nie można znaleźć danych o temperaturze.";
    }

    if (json.main && json.main.feels_like) {
        document.getElementById("feels-like-temperature").textContent = json.main.feels_like;
    } else {
        document.getElementById("feels-like-temperature").textContent = "Brak danych o odczuwalnej temperaturze.";
    }

    if (json.main && json.main.humidity) {
        document.getElementById("humidity").textContent = json.main.humidity;
    } else {
        document.getElementById("humidity").textContent = "Brak danych o wilgotności.";
    }

    if (json.main && json.main.pressure) {
        document.getElementById("pressure").textContent = json.main.pressure;
    } else {
        document.getElementById("pressure").textContent = "Brak danych o ciśnieniu.";
    }

    if (json.visibility) {
        document.getElementById("visibility").textContent = json.visibility;
    } else {
        document.getElementById("visibility").textContent = "Brak danych o widoczności.";
    }

    if (json.wind && json.wind.speed) {
        document.getElementById("wind-speed").textContent = json.wind.speed;
    } else {
        document.getElementById("wind-speed").textContent = "Brak danych o prędkości wiatru.";
    }
}

function getWeather() {
    // Pobierz wartość wpisaną w polu miasta
    const city = document.getElementById('city').value;

    // Skonstruuj URL zapytania do API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=37fca7b8c7481bc5d2965c47965c6237&units=metric`;

    // Wywołaj funkcję fetch do pobrania danych z API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Sprawdź, czy udało się pobrać dane
        if (data.cod === '404') {
          alert('Nie znaleziono miasta. Spróbuj ponownie.');
        } else {
          // Pobierz kod ikony pogodowej z danych
          const iconCode = data.weather[0].icon;

          // Ustaw ścieżkę obrazu na podstawie kodu ikony
          const iconPath = getIconPath(iconCode);

          // Zaktualizuj obrazek w elemencie o id "main-logo"
          document.getElementById('main-logo').src = iconPath;
        }
      })
      .catch(error => console.error('Błąd podczas pobierania danych:', error));
  }

  // Funkcja do mapowania kodu ikony na ścieżkę obrazu
  function getIconPath(iconCode) {
    const iconMapping = {
      '01d': 'clear-day.png',
      '01n': 'clear-night.png',
      '02d': 'partly-cloudy.png',
      '02n': 'partly-cloudy.png',
      '03d': 'cloudy.png',
      '03n': 'cloudy.png',
      '04d': 'cloudy.png',
      '04n': 'cloudy.png',
      '09d': 'rain.png',
      '09n': 'rain.png',
      '10d': 'rain-sun.png',
      '10n': 'rain.png',
      '11d': 'rain.png',
      '11n': 'rain.png',
      '13d': 'rain-snow.png',
      '13n': 'rain-snow.png',
      '50d': 'mist.png',
      '50n': 'mist.png',
      'sun': 'sun.png',
    };

    return iconMapping[iconCode] || 'unknown.png';
  }
    
  
function updateCurrentDate() {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('pl-PL', options);
        const currentDateDiv = document.getElementById("currentDate");
        currentDateDiv.textContent = formattedDate;
    }

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
updateCurrentDate();

var showTime = () => {
    console.log('run');
    let hour = document.getElementById('hour');
    let minute = document.getElementById('minute');
    let second = document.getElementById('second');
    let ampm = document.getElementById('ampm');


    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();

    let slot = "AM";
    if (hh>12){hh=hh-12;slot="PM"}
    let doubleNum = (num) => {
        num = num < 10 ? "0"+ num : num;
        return num;
    }

    hh = doubleNum(hh);
    mm = doubleNum(mm);
    ss = doubleNum(ss);

    hour.innerHTML = hh;
    minute.innerHTML = mm;
    secound.innerHTML = ss;
    ampm.innerHTML = slot;
}

setInterval(showTime,1000);

function getFiveDayForecast() {
    const city = document.getElementById('city').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=37fca7b8c7481bc5d2965c47965c6237&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                alert('Nie znaleziono miasta. Spróbuj ponownie.');
            } else {
                const dailyData = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));

                const days = document.querySelectorAll('.day');
                dailyData.forEach((dayData, index) => {
                    const date = new Date(dayData.dt_txt);
                    const dayElement = days[index];
                    const dayOfWeekElement = dayElement.querySelector('.day-of-week');
                    const temperatureElement = dayElement.querySelector('.temperature');
                    const windSpeedElement = dayElement.querySelector('.wind-speed');
                    const iconElement = dayElement.querySelector('.weather-icon');

                    const dayOfWeek = getDayOfWeek(date.getDay());
                    dayOfWeekElement.textContent = dayOfWeek;

                    temperatureElement.textContent = `Temperatura: ${dayData.main.temp.toFixed(1)}°C`;
                    windSpeedElement.textContent = `Prędkość wiatru: ${dayData.wind.speed.toFixed(1)} m/s`;

                    const iconCode = dayData.weather[0].icon;
                    const iconPath = getIconPath(iconCode);
                    iconElement.src = iconPath;
                });
            }
        })
        .catch(error => console.error('Błąd podczas pobierania danych:', error));
}

function getDayOfWeek(dayIndex) {
    const daysOfWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    return daysOfWeek[dayIndex];
}