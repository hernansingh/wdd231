const menuButton = document.getElementById("menu");
const navMobile = document.querySelector(".nav-mobile");

menuButton.addEventListener("click", function () {
  menuButton.classList.toggle("open");
  navMobile.classList.toggle("open");
});

document.getElementById("form-timestamp").value = new Date().toISOString();

// QUOTES

const quotesContainer = document.getElementById("quotes");

function renderQuotes(list) {
  quotesContainer.innerHTML = "";

  list.forEach((q) => {
    const fig = document.createElement("figure");
    fig.className = "quote-card";
    fig.innerHTML = `
            <blockquote class="quote-text">“${q.text}”</blockquote>
            <figcaption class="quote-author">— ${q.author}</figcaption>
        `;
    quotesContainer.appendChild(fig);
  });
}

async function loadQuotes() {
  try {
    const res = await fetch("./data/quotes.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderQuotes(data);
  } catch (err) {
    quotesContainer.innerHTML = `
        <p class="error">Quotes are unavailable right now.</p>
      `;
    console.error(err);
  }
}

loadQuotes();
