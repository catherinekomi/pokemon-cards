const grid = document.getElementById('pokemon-grid');
const limitSelect = document.getElementById('limit-select');
const popupSelect = document.getElementById('limit-select-popup');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const settingsBtn = document.getElementById('settings-btn');
const popup = document.getElementById('settings-popup');
const closePopupBtn = document.getElementById('close-popup');

let limit = 10;
let offset = 0;
let totalCount = 0;

// fetches list and details
async function loadPokemon() {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await res.json();
    totalCount = data.count;

    const pokemonDetails = await Promise.all(
      data.results.map((pokemon, i) =>
        fetch(pokemon.url)
          .then((res) => res.json())
          .then((info) => ({
            id: info.id,
            name: info.name,
            image: info.sprites.front_default,
          }))
      )
    );

    renderCards(pokemonDetails);
    updatePaginationButtons();
  } catch (err) {
    console.error('Something went wrong while fetching Pokemon:', err);
  }
}

// renders cards into the grid
function renderCards(pokemons) {
  grid.innerHTML = '';

  pokemons.forEach((pokemon, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="poke-id">${offset + i + 1}</div>
      <img src="${pokemon.image}" alt="${pokemon.name}" />
      <h3>${capitalize(pokemon.name)}</h3>
    `;
    grid.appendChild(card);
  });
}

// capitalizes first letter of a name
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// handle dropdown changes
limitSelect.addEventListener('change', (e) => {
  limit = parseInt(e.target.value);
  offset = 0;
  popupSelect.value = limit;
  loadPokemon();
});

popupSelect.addEventListener('change', (e) => {
  limit = parseInt(e.target.value);
  limitSelect.value = limit;
  offset = 0;
  loadPokemon();
});

// enable/disable pagination buttons based on current state
function updatePaginationButtons() {
  prevBtn.disabled = offset === 0;
  nextBtn.disabled = offset + limit >= totalCount;
}

// updates Next/Prev buttons text based on screen size
function updatePaginationLabels() {
  const isMobile = window.innerWidth <= 600;
  prevBtn.textContent = isMobile ? 'Previous' : 'Previous Page';
  nextBtn.textContent = isMobile ? 'Next' : 'Next Page';
}

// navigation button handlers
prevBtn.addEventListener('click', () => {
  if (offset >= limit) {
    offset -= limit;
    loadPokemon();
  }
});

nextBtn.addEventListener('click', () => {
  offset += limit;
  loadPokemon();
});

// popup toggle
settingsBtn.addEventListener('click', () => {
  popup.classList.remove('hidden');
});

closePopupBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// initial setup
updatePaginationLabels();
window.addEventListener('resize', updatePaginationLabels);
loadPokemon();
