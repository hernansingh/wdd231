//CLIMA

function formatearHora(timestamp) {
    const fecha = new Date(timestamp * 1000);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function mostrarClima() {
    try {
        const respuesta = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=-31.412944&lon=-64.191894&units=metric&appid=5905bd667bcf0a5abb2546c84aaa6adf');

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const datosClima = await respuesta.json();

        const tempElement = document.getElementById('temp');
        const maxTempElement = document.getElementById('max-temp');
        const lowTempElement = document.getElementById('low-temp');
        const humidityElement = document.getElementById('humidity');
        const sunsetElement = document.getElementById('sunset');
        const sunriseElement = document.getElementById('sunrise');

        console.log(datosClima);

        tempElement.textContent = `Temp: ${datosClima.main.temp}°C`;
        maxTempElement.textContent = `Max Temp: ${datosClima.main.temp_max}°C`;
        lowTempElement.textContent = `Low Temp: ${datosClima.main.temp_min}°C`;
        humidityElement.textContent = `Humidity: ${datosClima.main.humidity}%`;
        sunsetElement.textContent = `Sunset: ${formatearHora(datosClima.sys.sunset)}`;
        sunriseElement.textContent = `Sunrise: ${formatearHora(datosClima.sys.sunrise)}`;
        
    } catch (error) {
        console.error("Error al obtener el clima:", error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarClima();
});

//NEXT WEATHER

async function mostrarPronostico() {
    try {
        const respuesta = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=-31.412944&lon=-64.191894&units=metric&appid=5905bd667bcf0a5abb2546c84aaa6adf');

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datosPronostico = await respuesta.json();
        const listaPronosticos = datosPronostico.list;

        const pronosticosPorDia = {};
        listaPronosticos.forEach(item => {
            const fecha = new Date(item.dt * 1000).toDateString();
            if (!pronosticosPorDia[fecha]) {
                pronosticosPorDia[fecha] = item;
            }
        });

        const fechas = Object.keys(pronosticosPorDia);

        const pronosticoManana = pronosticosPorDia[fechas[1]];
        const pronosticoPasadoManana = pronosticosPorDia[fechas[2]];
        const pronosticoDiaSiguiente = pronosticosPorDia[fechas[3]];

        document.getElementById('today').textContent = `Today: ${pronosticoManana.main.temp} °C`;

        document.getElementById('tomorrow').textContent = `Tomorrow: ${pronosticoPasadoManana.main.temp} °C`;

        document.getElementById('other-day').textContent = `The day after tomorrow: ${pronosticoDiaSiguiente.main.temp} °C`;

    } catch (error) {
        console.error("Error al obtener el pronóstico:", error.message);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    mostrarPronostico();
});

// FOOTER
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;

// MENU
const menuButton = document.getElementById('menu');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('open');
    nav.classList.toggle('open');
});


// COMPANIES
const companiesContainer = document.getElementById("companies");
const listView = document.getElementById("listView");
const gridView = document.getElementById("gridView");


const displayCompanies = (companies) => {

    companiesContainer.innerHTML = "";

    companies.forEach((company) => {
        const card = document.createElement('section');
        const divFlex = document.createElement('div');
        const titleContainer = document.createElement('div');
        const infoContainer = document.createElement('div');
        const imgContainer = document.createElement('div');


        const businessName = document.createElement('h3');
        businessName.textContent = company.name;

        const businessTagLine = document.createElement('p');
        businessTagLine.textContent = company.otherInformation.sector;

        const email = document.createElement('p');
        email.innerHTML = `EMAIL: ${company.email}`;

        const phone = document.createElement('p');
        phone.innerHTML = `PHONE: ${company.phoneNumbers[0].number}`;

        const url = document.createElement('a');
        url.innerHTML = `URL: ${company.websiteURLs}`;
        url.href = company.websiteURLs;

        const imgLogo = document.createElement('img');
        imgLogo.src = company.iconFileName;
        imgLogo.alt = company.otherInformation.sector;
        imgLogo.setAttribute('loading', 'lazy');
        imgLogo.setAttribute('width', '125px');
        imgLogo.setAttribute('height', 'auto');

        titleContainer.appendChild(businessName);
        titleContainer.appendChild(businessTagLine);
        infoContainer.appendChild(email);
        infoContainer.appendChild(phone);
        infoContainer.appendChild(url);
        imgContainer.appendChild(imgLogo);
        divFlex.appendChild(imgContainer);
        divFlex.appendChild(infoContainer);

        card.appendChild(titleContainer);
        card.appendChild(divFlex);

        divFlex.classList.add('flex-column-container')
        titleContainer.classList.add('center-title')

        companiesContainer.appendChild(card);
    });
}

async function fetchCompanies() {
    const response = await fetch("data/members.json");
    const data = await response.json();
    companiesContainer.classList.add('members-container');
    displayCompanies(data);
}

fetchCompanies()

gridView.addEventListener('click', function() {
    fetchCompanies()
});



const displayCompaniesList = (companies) => {

    companiesContainer.innerHTML = "";

    companies.forEach((company) => {
        const cardList = document.createElement('div');
        cardList.classList.add('list-companies');

        const businessNameList = document.createElement('h3');
        businessNameList.textContent = company.name;

        const businessDirectionList = document.createElement('p');
        businessDirectionList.innerHTML = `${company.addresses[0].street}, ${company.addresses[0].city}, ${company.addresses[0].state}, ${company.addresses[0].postalCode}, ${company.addresses[0].country}`;

        const businessTagLineList = document.createElement('p');
        businessTagLineList.textContent = company.otherInformation.sector;

        const urlList = document.createElement('a');
        urlList.innerHTML = `URL: ${company.websiteURLs}`;
        urlList.href = company.websiteURLs;

        cardList.appendChild(businessNameList)
        cardList.appendChild(businessDirectionList)
        cardList.appendChild(businessTagLineList)
        cardList.appendChild(urlList)

        companiesContainer.appendChild(cardList);
    });
}

async function fetchCompaniesList() {
    const response = await fetch("data/members.json");
    const data = await response.json();
    displayCompaniesList(data);
}

listView.addEventListener('click', function() {
    companiesContainer.classList.remove('members-container');
    fetchCompaniesList()
});