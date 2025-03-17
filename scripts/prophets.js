const url = 'https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json';

const displayProphets = (prophets) => {
    const cards = document.getElementById('cards');

    prophets.forEach((prophet) => {
        const card = document.createElement('section');
        card.classList.add('styles-card');
        const fullName = document.createElement('h2');
        const portrait = document.createElement('img');
        const p = document.createElement('p');

        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        portrait.src = prophet.imageurl;
        portrait.alt = `${prophet.name} ${prophet.lastname}`;
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        p.innerHTML = `Birthdate: ${prophet.birthdate}<br>Place of Birth: ${prophet.birthplace}`;





        card.appendChild(fullName);
        card.appendChild(p);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}


async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    displayProphets(data.prophets)
}

getProphetData()