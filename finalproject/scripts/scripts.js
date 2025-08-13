const btnMenuResponsive = document.getElementById("menuToggle");
const navigation = document.getElementById("primaryNav");

// Toggle al click
btnMenuResponsive.addEventListener("click", () => {
  const expanded = btnMenuResponsive.getAttribute("aria-expanded") === "true";
  btnMenuResponsive.setAttribute("aria-expanded", String(!expanded));
  navigation.dataset.state = expanded ? "closed" : "open";
});

// Cerrar al elegir un link (en mobile)
navigation.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      btnMenuResponsive.setAttribute("aria-expanded", "false");
      navigation.dataset.state = "closed";
    }
  });
});

// Cerrar con Escape
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    btnMenuResponsive.getAttribute("aria-expanded") === "true"
  ) {
    btnMenuResponsive.setAttribute("aria-expanded", "false");
    navigation.dataset.state = "closed";
    btnMenuResponsive.focus();
  }
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
