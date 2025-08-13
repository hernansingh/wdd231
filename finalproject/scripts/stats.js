const myHabitsStats = document.getElementById("my-habits-stats");

const LS_MY_HABITS = "myHabits";
const LS_HABIT_NOTES = "habitNotes";

const state = {
  allHabits: [],
  myIds: [],
  notesById: {},
};

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function loadMyHabitsFromStorage() {
  try {
    var raw = localStorage.getItem(LS_MY_HABITS);
    var parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      state.myIds = parsed.map(String);
    } else {
      state.myIds = [];
    }
  } catch {
    state.myIds = [];
  }
}

function saveMyHabitsToStorage() {
  try {
    localStorage.setItem(LS_MY_HABITS, JSON.stringify(state.myIds));
  } catch {}
}

function loadHabitNotes() {
  try {
    var raw = localStorage.getItem(LS_HABIT_NOTES);
    var obj = raw ? JSON.parse(raw) : {};
    if (obj && typeof obj === "object") {
      state.notesById = obj;
    } else {
      state.notesById = {};
    }
  } catch {
    state.notesById = {};
  }
}

function saveHabitNotes() {
  try {
    localStorage.setItem(LS_HABIT_NOTES, JSON.stringify(state.notesById));
  } catch {}
}

async function loadAllHabits() {
  try {
    var res = await fetch("data/habits.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    if (Array.isArray(data)) {
      state.allHabits = data;
    } else {
      state.allHabits = [];
    }
  } catch {}
}

function getHabitById(id) {
  var sid = String(id);
  for (var i = 0; i < state.allHabits.length; i++) {
    var h = state.allHabits[i];
    if (String(h.id) === sid) {
      return h;
    }
  }
  return null;
}

function renderStats() {
  if (!state.myIds || state.myIds.length === 0) {
    myHabitsStats.innerHTML =
      '<p class="muted">No stats yet—go to Tracker and add habits to your favorites.</p>';
    return;
  }

  var listHTML = '<ul class="my-habits__list" role="list">';

  for (var i = 0; i < state.myIds.length; i++) {
    var id = state.myIds[i];
    var habit = getHabitById(id);
    if (!habit) continue;

    var notes = state.notesById[id];
    if (!Array.isArray(notes)) notes = [];

    // Lista de notas
    var notesHTML = "";
    var notesHTML = "";
    if (notes.length === 0) {
      notesHTML = '<li class="note-item is-empty">No notes yet.</li>';
    } else {
      for (var j = 0; j < notes.length; j++) {
        var note = notes[j] || {};
        var safeText = note.text ? escapeHTML(note.text) : "";
        var safeDate = note.dateISO || "";
        notesHTML +=
          '<li class="note-item"><span class="note-date">' +
          safeDate +
          ':</span> <span class="note-text">' +
          safeText +
          "</span></li>";
      }
    }

    // Card
    listHTML +=
      '<li class="fav-item" data-id="' +
      habit.id +
      '">' +
      '  <div class="fav-item__icon">' +
      habit.icon +
      "</div>" +
      '  <div class="fav-item__content">' +
      '    <h3 class="fav-item__title">' +
      habit.title +
      "</h3>" +
      '    <ul class="fav-item__meta">' +
      "      <li><strong>Category:</strong> " +
      habit.category +
      "</li>" +
      "      <li><strong>Difficulty:</strong> " +
      habit.difficulty +
      "</li>" +
      "      <li><strong>Recommended:</strong> " +
      habit.recommended_time +
      "</li>" +
      "    </ul>" +
      '    <p class="fav-item__desc">' +
      habit.description +
      "</p>" +
      // Notas
      '    <div class="fav-item__notes">' +
      "      <h4>Notes</h4>" +
      '      <ul class="notes-list">' +
      notesHTML +
      "</ul>" +
      '      <div class="note-form">' +
      '        <label for="note-text-' +
      habit.id +
      '"><strong>Add a note:</strong></label><br>' +
      '        <textarea id="note-text-' +
      habit.id +
      '" rows="3" placeholder="Write something about your progress..."></textarea><br>' +
      '        <button type="button" class="btn" data-action="save-note" data-id="' +
      habit.id +
      '">Save note</button>' +
      '        <span class="status" id="note-status-' +
      habit.id +
      '"></span>' +
      "      </div>" +
      "    </div>" +
      '    <div class="fav-item__actions">' +
      '      <button type="button" class="btn btn-reminder">Set Daily Reminder</button>' +
      '      <button type="button" class="btn-remove" data-action="remove-habit" data-id="' +
      habit.id +
      '">Remove</button>' +
      "    </div>" +
      "  </div>" +
      "</li>";
  }

  listHTML += "</ul>";
  myHabitsStats.innerHTML = listHTML;
}

//Acciones para los botones de Agregar nota y eliminar nota
function wireStatsEvents() {
  myHabitsStats.addEventListener("click", function (e) {
    var btn = e.target.closest("button");

    var action = btn.getAttribute("data-action");

    var id = btn.getAttribute("data-id");

    if (action === "save-note" && id) {
      handleSaveNote(id);
    } else if (action === "remove-habit" && id) {
      handleRemoveHabit(id);
    }
  });
}

function handleSaveNote(habitId) {
  var textarea = document.getElementById("note-text-" + habitId);
  var statusEl = document.getElementById("note-status-" + habitId);
  if (!textarea) return;

  var text = textarea.value;
  if (!text || text.trim() === "") {
    if (statusEl)
      statusEl.textContent = "Please write something before saving.";
    return;
  }

  var note = { dateISO: getTodayISO(), text: text.trim() };

  if (!Array.isArray(state.notesById[habitId])) {
    state.notesById[habitId] = [];
  }
  state.notesById[habitId].push(note);
  saveHabitNotes();

  textarea.value = "";
  if (statusEl) statusEl.textContent = "Saved!";
  renderStats();
}

function handleRemoveHabit(habitId) {
  var next = [];
  for (var i = 0; i < state.myIds.length; i++) {
    var id = state.myIds[i];
    if (id !== String(habitId)) next.push(id);
  }
  state.myIds = next;
  saveMyHabitsToStorage();
  renderStats();
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Init
async function initStats() {
  loadMyHabitsFromStorage();
  loadHabitNotes();
  await loadAllHabits();
  renderStats();
  wireStatsEvents();
}

initStats();
