export const STATE_CATALOG_URL = "./data/states.json";

export const activities = [
  {
    title: "Pega un cartel autorizado",
    text: "Coloca material en un lugar permitido y sube una foto clara.",
    points: 20,
  },
  {
    title: "Invita a 3 personas",
    text: "Registra contactos con consentimiento para sumar gente local.",
    points: 30,
  },
  {
    title: "Reporta una caca local",
    text: "Documenta obra absurda, abuso, promesa incumplida o contrato raro.",
    points: 50,
  },
  {
    title: "Asiste a una activación",
    text: "Participa en una acción estatal y confirma asistencia con evidencia.",
    points: 40,
  },
  {
    title: "Crea contenido satírico",
    text: "Meme, video, cartel o publicación que señale sin difamar.",
    points: 25,
  },
  {
    title: "Organiza una brigada",
    text: "Agenda una acción con mínimo cinco voluntarios y responsable claro.",
    points: 100,
  },
];

export const levels = [
  ["Salpicado", 50, 12],
  ["Cagón consciente", 150, 28],
  ["Brigadista del caos", 300, 46],
  ["Fiscal del olor", 600, 70],
  ["Leyenda del cagadero", 1000, 100],
];

const ranks = ["Lola H.", "Rafa M.", "Jimena P.", "Toño C."];

export async function loadStates(url = STATE_CATALOG_URL) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`No se pudo cargar el catálogo de estados: ${response.status}`);
  return response.json();
}

export function stateLabel(state) {
  return state.displayName || state.name;
}

function numberForState(state, base) {
  return [...state].reduce((sum, char) => sum + char.charCodeAt(0), base);
}

export function statsForState(state) {
  const seed = numberForState(state, 0);
  return {
    volunteers: 80 + (seed % 180),
    activities: 5 + (seed % 9),
    points: 3200 + seed * 9,
  };
}

function fillSelect(select, states) {
  select.innerHTML = states
    .map((state) => `<option value="${state.name}">${stateLabel(state)}</option>`)
    .join("");
}

function renderState(state) {
  const stats = statsForState(state);
  document.querySelector("#stateName").textContent = state;
  document.querySelector("#volunteerCount").textContent = stats.volunteers.toLocaleString("es-MX");
  document.querySelector("#activityCount").textContent = stats.activities.toLocaleString("es-MX");
  document.querySelector("#statePoints").textContent = stats.points.toLocaleString("es-MX");
  document.querySelector("#rankingList").innerHTML = ranks
    .map((name, index) => `<li>${name} - ${stats.points - index * 420} pts</li>`)
    .join("");
}

function renderActivities() {
  document.querySelector("#activityGrid").innerHTML = activities
    .map(
      (activity) => `
        <article class="activity">
          <p class="cardLabel">${activity.points} puntos</p>
          <h3>${activity.title}</h3>
          <p>${activity.text}</p>
          <span class="pointsBadge">Requiere evidencia</span>
        </article>
      `,
    )
    .join("");
}

function renderLevels() {
  document.querySelector("#levels").innerHTML = levels
    .map(
      ([name, points, progress]) => `
        <article class="level">
          <p class="cardLabel">${points} pts</p>
          <h3>${name}</h3>
          <p>Reconocimiento por participación verificada.</p>
          <div class="levelMeter" aria-hidden="true"><span style="width: ${progress}%"></span></div>
        </article>
      `,
    )
    .join("");
}

export async function init() {
  renderActivities();
  renderLevels();
  const states = await loadStates();
  const stateSelect = document.querySelector("#stateSelect");
  const formState = document.querySelector("#formState");
  fillSelect(stateSelect, states);
  fillSelect(formState, states);
  renderState(stateSelect.selectedOptions[0].textContent);
  stateSelect.addEventListener("change", () => {
    formState.value = stateSelect.value;
    renderState(stateSelect.selectedOptions[0].textContent);
  });
}

if (typeof document !== "undefined") {
  init().catch(console.error);
}
