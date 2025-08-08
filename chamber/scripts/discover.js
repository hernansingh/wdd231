const interestTopicsContainer = document.getElementById("interest-topics");

const displayInterestTopics = (topics) => {
  interestTopicsContainer.innerHTML = "";

  topics.forEach((topic) => {
    const card = document.createElement("section");
    card.className = "interest-card";

    const title = document.createElement("h2");
    title.textContent = topic.theme;

    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = topic.image;
    img.alt = topic.theme;
    img.loading = "lazy";
    img.width = 300;
    img.height = 200;
    figure.appendChild(img);

    const addressEl = document.createElement("address");
    addressEl.textContent = topic.address;

    const desc = document.createElement("p");
    desc.textContent = topic.description;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Learn more";
    btn.className = "learn-more";

    card.append(title, figure, addressEl, desc, btn);
    interestTopicsContainer.appendChild(card);
  });
};

async function fetchInterestSubjects() {
  const response = await fetch("data/interest.json");
  if (!response.ok) throw new Error("Failed to load interest items JSON");
  const data = await response.json();
  displayInterestTopics(data);
}

fetchInterestSubjects();


// Last Visit Session
const first_visit = `Welcome! Let us know if you have any questions`
const fast_visit = `Back so soon! Awesome!`
const long_last_visit = `You last visited days ago`

const msToDays = 86_400_000; 

const headingLastSession = document.querySelector("#h4-last-session");

const stored = localStorage.getItem("Visita");

if (stored === null) {

  localStorage.setItem("Visita", Date.now().toString())
  headingLastSession.innerHTML = "";
  headingLastSession.textContent = `${first_visit}`

  } else {

  let lastMs = Number(stored);
  
  if (Number.isNaN(lastMs)) {
    const parsed = Date.parse(stored);
    lastMs = Number.isNaN(parsed) ? now : parsed;
    localStorage.setItem("Visita", lastMs.toString());
  }

  const now = Date.now();
  const diffMs = now - lastMs;
  const days = Math.floor(diffMs / msPerDay);

  if ((diffMs < 86400000)) {
    headingLastSession.innerHTML = "";
    headingLastSession.textContent = fast_visit;

  } else if (days === 1) {
    headingLastSession.textContent = `You last visited 1 day ago`;
  } else if (days === 2) {
    headingLastSession.textContent = `You last visited 2 days ago`;
  } else {
    headingLastSession.textContent = `You last visited ${days} days ago`;
  }

  localStorage.setItem("Visita", now.toString());

  }