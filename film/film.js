import { aggiungiFilm, getListaFilm, deleteFilm } from '../gestioneCard.js';

const containerEl = document.querySelector(".card-container");
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageIndicator = document.getElementById('pageIndicator');
const searchBarFilmEl = document.getElementById('searchBarFilm');
const searchBarAnnoeEl = document.getElementById('searchBarAnno');
const errorFilm = document.getElementById('error-film');
const errorAnno = document.getElementById('error-anno');
const popup = document.getElementById('popup');
const popupContent = document.querySelector('.popup-content');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const votoMedio = document.getElementById("votoMedio");
const deleteBtn = document.getElementById('deleteBtn');
const deletePopup = document.getElementById('deleteAccountPopup');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const closeDeletePopupBtn = document.getElementById('closeDeletePopup');

const API_KEY = "f10acf0bec0178312ba7abca86ffe246";
const apiMovie= `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=53`;

let movies = [];
let currentPage = 1;
let totalPages = 1;

async function getMovie(page = 1) {
  try {
    const response = await fetch(`${apiMovie}&page=${page}`);
    if (!response.ok) {
      throw new Error("ERROR");
    }
    const data = await response.json();
    movies = data.results;
    currentPage = data.page;
    totalPages = data.total_pages;
    displayMovies(movies);
    updatePagination();
  } catch (error) {
    console.error(error);
  }
}

getMovie();

const updatePagination = () => {
  pageIndicator.textContent = `Page ${currentPage}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
};

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    if(searchBarAnnoeEl.value){
      getMovieAnno(searchBarAnnoeEl.value,currentPage - 1);
    } else{
      getMovie(currentPage - 1);
    }
    scrollToTop();
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    if(searchBarAnnoeEl.value){
      getMovieAnno(searchBarAnnoeEl.value,currentPage + 1);
    } else{
      getMovie(currentPage + 1);
    }
    scrollToTop();
  }
});

const displayMovies = (movies) => {
  containerEl.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
      <h3>${movie.title}</h3>
      <p>${movie.overview}</p>
    `;
    movieCard.addEventListener('click', () => showPopup(movie));
    if(getListaFilm().find(savedMovie => savedMovie.id === movie.id)){
      movieCard.style.border =  "3px solid var(--color-yellow)";
    } else {
      movieCard.style.border =  "";
    }
    containerEl.appendChild(movieCard);
  });
};

const showPopup = (movie) => {
  modalTitle.innerText = movie.title + " (" + movie.release_date.substring(0,4) + ")"; //from begin to end (end not included) where begin and end represent the index of characters in that string. (https://stackoverflow.com/)
  modalDescription.innerText = movie.overview;
  votoMedio.innerText = parseFloat(movie.vote_average.toFixed(1))+"/10";
  
  
  const actionsContainer = document.querySelector('.popup-content .actions');
  if (actionsContainer) {
    actionsContainer.remove();
  }
  
  const newActionsContainer = document.createElement('div');
  newActionsContainer.classList.add('actions');
  
  // Creo e aggiungo le icone delle azioni
  const saveIcon = document.createElement('img');
  saveIcon.src = "../Icone/salva.svg";
  saveIcon.classList.add('action-icon');
  saveIcon.id = "saveIcon";
  saveIcon.alt = "Save";
  saveIcon.title = "Save";
  if(!getListaFilm().find(savedMovie => savedMovie.id === movie.id)){
    saveIcon.style.display = 'inline-block';
  }else{
    saveIcon.style.display = 'none';
  } 
  
  const removeIcon = document.createElement('img');
  removeIcon.src = "../Icone/rimuovi.svg";
  removeIcon.classList.add('action-icon');
  removeIcon.id = "removeIcon";
  removeIcon.alt = "Remove";
  removeIcon.title = "Remove";
  if(!getListaFilm().find(savedMovie => savedMovie.id === movie.id)){
    removeIcon.style.display = 'none';
  }else{
    removeIcon.style.display = 'inline-block';
  } 
  
  const likeIcon = document.createElement('img');
  likeIcon.src = "../Icone/Like.svg";
  likeIcon.classList.add('action-icon');
  likeIcon.id = "likeIcon";
  likeIcon.alt = "Like";
  likeIcon.title = "Like";
  
  const dislikeIcon = document.createElement('img');
  dislikeIcon.src = "../Icone/no like.svg";
  dislikeIcon.classList.add('action-icon');
  dislikeIcon.id = "dislikeIcon";
  dislikeIcon.alt = "I don't like";
  dislikeIcon.title = "I don't like";
  
  // Aggiungo gli eventi alle icone
  saveIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    aggiungiFilm(movie);
    saveIcon.style.display = 'none';
    removeIcon.style.display = 'inline-block';
    showToast("You have added the movie to your list!");
    searchBarFilmEl.value = "";
    searchBarAnnoeEl.value = "";
    popup.style.display = 'none';
    
  });
  
  removeIcon.addEventListener('click', () => {
    saveIcon.style.display = 'inline-block';
    removeIcon.style.display = 'none';
    deleteFilm(movie);
    showToast("You have removed the movie from your list!")
    searchBarFilmEl.value = "";
    searchBarAnnoeEl.value = "";
    popup.style.display = 'none';
    
  });
  
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('fas'); // Cambia lo stile per indicare "mi piace"
    likeIcon.classList.toggle('far');
  });
  
  dislikeIcon.addEventListener('click', () => {
    dislikeIcon.classList.toggle('fas'); // Cambia lo stile per indicare "non mi piace"
    dislikeIcon.classList.toggle('far');
  });
  
  // Aggiunge le icone al container delle azioni
  newActionsContainer.appendChild(saveIcon);
  newActionsContainer.appendChild(removeIcon);
  newActionsContainer.appendChild(likeIcon);
  newActionsContainer.appendChild(dislikeIcon);
  
  // Aggiungo il container delle azioni al popup
  popupContent.appendChild(newActionsContainer);
  
  // Mostra il popup
  popup.style.display = "flex";
};


// Evento click per la X
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
  }   else if (event.target === deletePopup) {
    deletePopup.style.display = 'none';
  }
});

const scrollToTop = () => {
  window.scrollTo({
    top: 600,
    behavior: 'smooth' // Scorrimento dolce
  });
};

function showToast(message, isError = false) {
  const toast = document.createElement("div");//creo un nuovo elemento che ho chiamato div
  toast.className = "toast"; //ho un div che ha una classe toast
  if (isError) {
    toast.classList.add("error");//la lista delle classi della variabile
  } else {
    toast.classList.add("success");
  }
  toast.textContent = message;
  toast.style.zIndex = 99999;
  
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.add("show");
    getMovie(currentPage);
  }, 100); // Dopo questi secondo (add = aggiungo) la classe show alle precedenti classi aggiunte che ho riportato anche in CSS
  
  setTimeout(function() {
    toast.classList.remove("show"); //con il remove tolgo le classi
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 300); // per levare il toast del DOM quindi riga54
  }, 3000); // 3 secondi di visibilità del toast
}



const profileDropdown = document.getElementById('profileDropdown');
const dropdownNav = document.querySelector('.Dropdown-nav');
const logoutBtn = document.getElementById('logoutBtn');

profileDropdown.addEventListener('click', function() {
  dropdownNav.classList.toggle('is-expanded');
  
});

logoutBtn.addEventListener('click', function(e) {
  e.preventDefault();
  // Logica di logout
  window.location.href = "/index.html"; // Reindirizzamento alla pagina index.html
});

const apiFilm = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`;

async function getMovieFilm(searchFilm,page = 1) {
  try {
    const response = await fetch(`${apiFilm}&page=${page}&query=${searchFilm}`);
    if (!response.ok) {
      throw new Error("ERROR");
    }
    const data = await response.json();
    movies = data.results.filter(movie => movie.genre_ids.includes(53));
    currentPage = page;
    totalPages = data.total_pages;
    displayMovies(movies);
    updatePagination();
  } catch (error) {
    console.error(error);
  }
}


const valoreUrlFilm = new URLSearchParams(window.location.search).get('searchFilm'); //prende URL e con il .get da il valore dela chiave che inserisco dentro le ()
if (valoreUrlFilm) {
  searchBarFilmEl.value = valoreUrlFilm;
  prevPageBtn.style="display:none";
  nextPageBtn.style="display:none";
  pageIndicator.style="display:none";
  getMovieFilm(searchBarFilmEl.value);
}

searchBarFilmEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (searchBarFilmEl.value){
      if (searchBarFilmEl.value.length > 3){
        searchBarAnnoeEl.value ="";
        getMovieFilm(searchBarFilmEl.value);
        prevPageBtn.style="display:none";
        nextPageBtn.style="display:none";
        pageIndicator.style="display:none";
        errorFilm.style.display = 'none';
      }
      else{
        errorFilm.style.display = 'block';
      }
    }
    else{
      getMovie();
      prevPageBtn.style="display:block";
      nextPageBtn.style="display:block";
      pageIndicator.style="display:block";
    }
  }
});


async function getMovieAnno(dataRelease,page = 1) {
  try {
    const response = await fetch(`${apiMovie}&page=${page}&primary_release_year=${dataRelease}`);
    if (!response.ok) {
      throw new Error("ERROR");
    }
    const data = await response.json();
    movies = data.results;
    currentPage = data.page;
    totalPages = data.total_pages;
    displayMovies(movies);
    updatePagination();
  } catch (error) {
    console.error(error);
  }
}

searchBarAnnoeEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (searchBarAnnoeEl.value){
      if (searchBarAnnoeEl.value.length > 3){
        prevPageBtn.style="display:block";
        nextPageBtn.style="display:block";
        pageIndicator.style="display:block";
        searchBarFilmEl.value ="";
        getMovieAnno(searchBarAnnoeEl.value);
        errorAnno.style.display = 'none';
      } else{
        errorAnno.style.display = 'block';
      }
    }
    else{
      getMovie();
    }
  }
});

// Mostra il popup quando si clicca su "Delete Account"
deleteBtn.addEventListener('click', (e) => {
  e.preventDefault(); // Impedisce il comportamento predefinito del link
  // Mostra il popup
  deletePopup.style.display = 'flex';
});

// Chiude il popup quando si clicca sul pulsante di chiusura (×)
closeDeletePopupBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none';
});

// Chiude il popup quando si clicca sul pulsante "Cancel"
cancelDeleteBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none';
});

// Azioni da eseguire quando si clicca su "Confirm"
confirmDeleteBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none'; // Chiudi il popup dopo aver confermato l'eliminazione
  localStorage.removeItem("username"); 
  localStorage.removeItem("password"); 
  localStorage.removeItem("moviesLaMiaLista")
  window.location.href = "/index.html"; // Reindirizzamento alla pagina index.html
});