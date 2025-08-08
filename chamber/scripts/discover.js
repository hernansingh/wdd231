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

const msPerDay = 86400000;

const headingLastSession = document.querySelector("#h4-last-session");

const stored = localStorage.getItem("Visita");

const last   = Number(stored || 0);

if (stored === null) {
  headingLastSession.textContent = `${first_visit}`
  localStorage.setItem('Visita', String(Date.now()));

} else {
  const now = Date.now();
  const days = Math.floor((now - last) / msPerDay);

  if (days < 1) {
    headingLastSession.textContent = fast_visit;
  } else if (days === 1) {
    headingLastSession.textContent = `You last visited 1 day ago`;
  } else {
    headingLastSession.textContent = `You last visited ${days} days ago`;
  }

  localStorage.setItem("Visita", now.toString());

}