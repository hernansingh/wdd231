const habitsContainer = document.getElementById("cards__habits");
const habitsFilters = document.querySelector(".btn-filters");

// State
const state = {
  allHabits: [],
  visibleHabits: [],
  activeFilter: "all",
};

// Setear estados de hábitos
function setAllHabits(list) {
  if (Array.isArray(list)) {
    state.allHabits = list;
  } else {
    state.allHabits = [];
  }
}

function setActiveFilter(value) {
  state.activeFilter = value;
}

function recomputeVisibleHabits() {
  const f = state.activeFilter;
  if (f === "all") {
    state.visibleHabits = state.allHabits.slice();
  } else {
    state.visibleHabits = state.allHabits.filter(function (habit) {
      return habit.category === f;
    });
  }
}

// Mensajes de estado
function showLoading() {
  habitsContainer.innerHTML = `<p class="muted">Loading habits…</p>`;
}
function showError(msg = "Failed to load habits. Please try again later.") {
  habitsContainer.innerHTML = `<p class="error">${msg}</p>`;
}
function showEmpty(msg = "No habits found for this filter.") {
  habitsContainer.innerHTML = `<p class="muted">${msg}</p>`;
}

// Fetch de hábitos
async function loadHabits() {
  showLoading();
  try {
    const res = await fetch("data/habits.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setAllHabits(data);
  } catch (err) {
    console.error("Habits fetch error:", err);
    showError("Could not load habits. Check your connection or try again.");
    return false;
  }
  return true;
}

// Funcion para colocar "is-active" y "aria-pressed" en cada vez que se haga click en los filtros
function updateFilterButtonsUI(nextFilter) {
  const btns = habitsFilters.querySelectorAll(".filter-btn");
  btns.forEach(function (btn) {
    let isActive;
    if (btn.dataset.filter === nextFilter) {
      isActive = true;
    } else if (nextFilter === "all" && btn.dataset.filter === "all") {
      isActive = true;
    } else {
      isActive = false;
    }
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function wireFilterEvents() {
  habitsFilters.addEventListener("click", function (e) {
    const btn = e.target.closest(".filter-btn");

    const next = btn.dataset.filter || "all";
    if (next === state.activeFilter) return; //Si el botón ya está seleccionado, no se hace nada

    setActiveFilter(next);
    updateFilterButtonsUI(next);
    recomputeVisibleHabits();
    displayHabitsOnContainer(state.visibleHabits);
  });
}

//Iniciacion del contenedor
async function initTracker() {
  setActiveFilter("all");
  updateFilterButtonsUI("all");

  loadMyHabitsFromStorage();

  const ok = await loadHabits();
  if (!ok) return;

  recomputeVisibleHabits();
  if (state.visibleHabits.length === 0) {
    showEmpty();
  } else {
    displayHabitsOnContainer(state.visibleHabits);
  }

  renderMyHabits();
  wireFilterEvents();
}

initTracker();

function displayHabitsOnContainer(habits) {
  const cardsHTML = habits.map(function (habit) {
    const inFavs = isInMyHabits(habit.id);
    let ariaPressed;

    if (inFavs) {
      ariaPressed = "true";
    } else {
      ariaPressed = "false";
    }

    let titleText;
    if (inFavs) {
      titleText = "Already in My Habits";
    } else {
      titleText = "Add to My Habits";
    }

    let addBtnHTML;
    if (inFavs) {
      addBtnHTML = `
        <button
          class="btn-add is-added"
          data-id="${habit.id}"
          aria-pressed="${ariaPressed}"
          title="${titleText}"
          type="button"
          disabled
        >
          ✔ Added
        </button>
      `;
    } else {
      addBtnHTML = `
        <button
          class="btn-add"
          data-id="${habit.id}"
          aria-pressed="${ariaPressed}"
          title="${titleText}"
          type="button"
        >
          ＋ Add Habit
        </button>
      `;
    }

    return `
      <article class="habit-card" data-id="${habit.id}">
        <div class="habit-card__icon">${habit.icon}</div>
        <h3 class="habit-card__title">${habit.title}</h3>
        <p class="habit-card__category"><strong>Category:</strong> ${habit.category}</p>
        <p class="habit-card__difficulty"><strong>Difficulty:</strong> ${habit.difficulty}</p>
        <p class="habit-card__time"><strong>Recommended:</strong> ${habit.recommended_time}</p>
        <p class="habit-card__desc">${habit.description}</p>

        <div class="habit-card__actions">
          ${addBtnHTML}
        </div>
      </article>
    `;
  });

  habitsContainer.innerHTML = cardsHTML.join("");
}

// CODE FOR SECTION MY HABITS
const myHabitsContainer = document.getElementById("my-habits-container");
const LS_KEY = "myHabits";
state.myHabitsIds = [];

function loadMyHabitsFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      state.myHabitsIds = parsed.map(String);
    } else {
      state.myHabitsIds = [];
    }
  } catch {
    state.myHabitsIds = [];
  }
}

function saveMyHabitsToStorage() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state.myHabitsIds));
  } catch {}
}

function isInMyHabits(id) {
  const sid = String(id);
  return state.myHabitsIds.includes(sid);
}

function addToMyHabits(id) {
  const sid = String(id);
  if (!isInMyHabits(sid)) {
    state.myHabitsIds.push(sid);
    saveMyHabitsToStorage();
    renderMyHabits();
  }
}

function removeFromMyHabits(id) {
  const sid = String(id);
  state.myHabitsIds = state.myHabitsIds.filter((x) => x !== sid);
  saveMyHabitsToStorage();
  renderMyHabits();
}

habitsContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  if (btn.disabled) return;

  const id = btn.getAttribute("data-id");
  addToMyHabits(id);

  recomputeVisibleHabits();
  displayHabitsOnContainer(state.visibleHabits);
});

function renderMyHabits() {
  if (!myHabitsContainer) return;

  if (!state.myHabitsIds.length) {
    myHabitsContainer.innerHTML = `<p class="muted">No habits yet—add some from the catalog.</p>`;
    return;
  }

  const byId = new Map(state.allHabits.map((h) => [String(h.id), h]));

  const items = state.myHabitsIds
    .map(function (sid) {
      const h = byId.get(sid);
      if (!h) return "";

      return `
      <li class="fav-item" data-id="${h.id}">
        <div class="fav-item__icon">${h.icon}</div>

        <div class="fav-item__content">
          <h3 class="fav-item__title">${h.title}</h3>

          <ul class="fav-item__meta">
            <li><strong>Category:</strong> ${h.category}</li>
            <li><strong>Difficulty:</strong> ${h.difficulty}</li>
            <li><strong>Recommended:</strong> ${h.recommended_time}</li>
          </ul>

          <p class="fav-item__desc">${h.description}</p>

          <div class="fav-item__actions">
            <a class="btn-reminder"
               href="stats.html?habit=${encodeURIComponent(h.id)}"
               title="Set reminder">⏰ Set Daily Reminder</a>

            <button class="btn-remove"
                    aria-label="Remove ${h.title}"
                    title="Remove"
                    type="button">Remove</button>
          </div>
        </div>
      </li>
    `;
    })
    .join("");

  myHabitsContainer.innerHTML = `
    <ul class="my-habits__list" role="list">
      ${items}
    </ul>
  `;
}

myHabitsContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-remove");
  if (!btn) return;

  const item = e.target.closest(".fav-item");
  if (!item) return;

  const id = item.getAttribute("data-id");
  removeFromMyHabits(id);

  // sincronizar catálogo
  recomputeVisibleHabits();
  displayHabitsOnContainer(state.visibleHabits);
});
