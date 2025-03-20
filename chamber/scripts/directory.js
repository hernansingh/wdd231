const menuButton = document.getElementById('menu');
const nav = document.querySelector('.nav');
const companiesContainer = document.getElementById("companies");
const listView = document.getElementById("listView");
const gridView = document.getElementById("gridView");

menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('open');
    nav.classList.toggle('open');
});

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;

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