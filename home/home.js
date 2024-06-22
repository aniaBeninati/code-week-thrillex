import { aggiungiFilm, getListaFilm, deleteFilm } from '../gestioneCard.js';


const containerEl = document.querySelector(".card-container-content");
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const containerElRated = document.querySelector(".card-container-content-rated");
const prevPageBtnRated = document.getElementById('prevPageRated');
const nextPageBtnRated = document.getElementById('nextPageRated');
const ulTopFiveEl = document.querySelector('.top-five');
const cercaFilmBtn = document.getElementById('cercaFilm');
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
const apiMovie = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=53&sort_by=popularity`;
const apiMovieRated = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=53&sort_by=vote_average.desc&vote_count.gte=1000`;
const apiTopFive = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=53&sort_by=vote_average.desc&vote_count.gte=1000&sort_by=release_date.desc`;

let movies = [];
let currentPage = 1;
let totalPages = 1;

let moviesRated = [];
let currentPageRated = 1;
let totalPagesRated = 1;

let moviesTopFive = [];

async function getMovie(page = 1) {
  try {
    const response = await fetch(`${apiMovie}&page=${page}`);
    if (!response.ok) {
      throw new Error("ERROR");
    }
    const data = await response.json();
    movies = movies.concat(data.results);
    currentPage = data.page;
    totalPages = data.total_pages;
    displayMovies(movies);
    updatePagination();
  } catch (error) {
    console.error(error);
  }
}

async function getMovieRated(page = 1) {
  try {
    const response = await fetch(`${apiMovieRated}&page=${page}`);
    if (!response.ok) {
      throw new Error("ERROR");
    }
    const data = await response.json();
    moviesRated = moviesRated.concat(data.results);
    currentPageRated = data.page;
    totalPagesRated = data.total_pages;
    displayMoviesRated(moviesRated);
    updatePaginationRated();
  } catch (error) {
    console.error(error);
  }
}

async function getFiveMovie() {
  try {
    const response = await fetch(apiTopFive);
    if (!response.ok) {
      throw new Error("ERROR");
    }
    const data = await response.json();
    moviesTopFive = data.results;
    displayMoviesTopFive(moviesTopFive);
    updatePagination();
  } catch (error) {
    console.error(error);
  }
}

getMovie();
getMovieRated();
getFiveMovie()

const updatePagination = () => {
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
};

const updatePaginationRated = () => {
  prevPageBtnRated.disabled = currentPageRated === 1;
  nextPageBtnRated.disabled = currentPageRated === totalPagesRated;
};

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    getMovie(currentPage - 1);
  }
});

prevPageBtnRated.addEventListener('click', () => {
  if (currentPageRated > 1) {
    getMovieRated(currentPageRated - 1);
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    getMovie(currentPage + 1);
  }
});

nextPageBtnRated.addEventListener('click', () => {
  if (currentPageRated < totalPagesRated) {
    getMovieRated(currentPageRated + 1);
  }
});


const displayMovies = (movies) => {
  containerEl.innerHTML = ''; // Pulisce il contenuto attuale del carosello
  const startIndex = (currentPage - 1) * 4; // Calcola l'indice di partenza per i film da mostrare
  const endIndex = startIndex + 4; // Calcola l'indice di fine
  
  
  for (let i = startIndex; i < endIndex; i++) {
    if (movies[i]) {
      const movie = movies[i];
      const movieCard = document.createElement('div');
      movieCard.classList.add('cardHome');
      movieCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster"> `;
      movieCard.addEventListener('click', () => showPopup(movie));
      if(getListaFilm().find(savedMovie => savedMovie.id === movie.id)){
        movieCard.style.border =  "3px solid var(--color-yellow)";
      } else {
        movieCard.style.border =  "";
      }
      containerEl.appendChild(movieCard);
    }
  }
};

const displayMoviesRated = (movies) => {
  containerElRated.innerHTML = ''; // Pulisce il contenuto attuale del carosello
  const startIndex = (currentPageRated - 1) * 4; // Calcola l'indice di partenza per i film da mostrare
  const endIndex = startIndex + 4; // Calcola l'indice di fine
  
  
  for (let i = startIndex; i < endIndex; i++) {
    if (movies[i]) {
      const movie = movies[i];
      const movieCard = document.createElement('div');
      movieCard.classList.add('cardHome');
      movieCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster"> `;
      movieCard.addEventListener('click', () => showPopup(movie));
      if(getListaFilm().find(savedMovie => savedMovie.id === movie.id)){
        movieCard.style.border =  "3px solid var(--color-yellow)";
      } else {
        movieCard.style.border =  "";
      }
      containerElRated.appendChild(movieCard);
    }
  }
};



//solo per lo card TOP 5 CON VIDEO YOU TUBE 

const displayMoviesTopFive = (moviesTopFive) => {
  const youTubeLinks = [
    "https://www.youtube.com/embed/9U7iQWzXi1s",  //You must ensure the URL contains embed rather watch as the /embed endpoint allows outside requests, whereas the /watch endpoint does not. (https://stackoverflow.com/)
    "https://www.youtube.com/embed/fSoZFrvLeew",  
    "https://www.youtube.com/embed/2rKc-PDzGzc",  
    "https://www.youtube.com/embed/6EsA5XHNiGc",
    "https://www.youtube.com/embed/Io_d_woiis8"
  ];
  
  ulTopFiveEl.innerHTML = ''; // Pulisce il contenuto attuale del carosello
  for (let i = 0; i < 5; i++) {
    if (moviesTopFive[i]) {
      let elemento = moviesTopFive[i];
      const movieCardTop = document.createElement('li');
      movieCardTop.classList.add('top-fiveLi');
      movieCardTop.style.setProperty('--bg', `url(https://image.tmdb.org/t/p/w500${elemento.poster_path})`);
      if(getListaFilm().find(savedMovie => savedMovie.id === elemento.id)){
        movieCardTop.style.border =  "3px solid var(--color-yellow)";
      } else {
        movieCardTop.style.border =  "";
      }
      
      // Aggiungi evento click per aprire il popup con il video di YouTube
      movieCardTop.addEventListener('click', () => showYouTubePopup(youTubeLinks[i], elemento));
      ulTopFiveEl.appendChild(movieCardTop);
    }
  }
};

// Funzione per mostrare il popup del video di YouTube
const showYouTubePopup = (youtubeLink, movie) => {
  const youtubePopup = document.createElement('div');
  youtubePopup.classList.add('youtube-popup');
  
  const iframe = document.createElement('iframe');
  iframe.src = `${youtubeLink}?autoplay=1`; // Aggiungere ?autoplay=1 per avviare il video automaticamente
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay'); //You not only need to add the autoplay=1 as a query param, but also add allow='autoplay' as an iframe's attribute (https://stackoverflow.com/)
  
  iframe.style.width = '100%'; // Imposta la larghezza dell'iframe al 100%
  iframe.style.height = '315px'; // Imposta un'altezza fissa per l'iframe
  
  youtubePopup.appendChild(iframe);
  
  showPopup(movie)
  
  popupContent.insertBefore(youtubePopup, popupContent.children[1]);
  
  // Mostra il popup
  popup.style.display = 'flex';
  
  // Chiudi il popup quando viene cliccata la X
  closeBtn.addEventListener('click', () => {
    youtubePopup.remove();
    popup.style.display = 'none';
  });
  
  // Chiudi il popup cliccando fuori da esso
  window.addEventListener('click', (event) => {
    if (event.target === popup) {
      youtubePopup.remove();
      popup.style.display = 'none';
    }
  });
};


// Fine 5 TOP 5 CON VIDEO YOU TUBE


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
  
  // Crea e aggiungi le icone delle azioni
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
  
  // Aggiungi gli eventi alle icone
  saveIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    aggiungiFilm(movie);
    saveIcon.style.display = 'none';
    removeIcon.style.display = 'inline-block';
    showToast("You have added the movie to your list!");
  });
  
  removeIcon.addEventListener('click', () => {
    saveIcon.style.display = 'inline-block';
    removeIcon.style.display = 'none';
    deleteFilm(movie);
    showToast("You have removed the movie from your list!")
  });
  
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('fas'); // Cambia lo stile per indicare "mi piace"
    likeIcon.classList.toggle('far');
  });
  
  dislikeIcon.addEventListener('click', () => {
    dislikeIcon.classList.toggle('fas'); // Cambia lo stile per indicare "non mi piace"
    dislikeIcon.classList.toggle('far');
  });
  
  // Aggiungi le icone al container delle azioni
  newActionsContainer.appendChild(saveIcon);
  newActionsContainer.appendChild(removeIcon);
  newActionsContainer.appendChild(likeIcon);
  newActionsContainer.appendChild(dislikeIcon);
  
  // Aggiungi il container delle azioni al popup
  popupContent.appendChild(newActionsContainer);
  
  // Mostra il popup
  popup.style.display = "flex";
};



const scrollToTop = () => {
  window.scrollTo({
    top: 600,
    behavior: 'smooth'
  });
};


const profileDropdown = document.querySelector('.Dropdown-profile');
const dropdownNav = document.querySelector('.Dropdown-nav');
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', function(e) {
  e.preventDefault();
  // Logica di logout
  window.location.href = "/index.html"; // Reindirizzamento alla pagina index.html
});

const searchBox = document.getElementById('top-search');
const lupe = document.getElementById('top-search-text');

lupe.addEventListener('click', () => openBar());

function openBar() {
  searchBox.classList.toggle('active');
}

document.addEventListener('click',(e) =>{
  if(!searchBox.contains(e.target)){
    searchBox.classList.remove('active');
  }
  if(!profileDropdown.contains(e.target)){
    dropdownNav.classList.remove('is-expanded');
  } 
})


cercaFilmBtn.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const searchFilm = cercaFilmBtn.value;
    window.location.href = `/film/film.html?searchFilm=${searchFilm}`;
  }
});


// Evento click per la X
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
  else if (event.target === deletePopup) {
    deletePopup.style.display = 'none';
  }
});


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
    getFiveMovie();
    getMovie(currentPage);
    getMovieRated(currentPageRated);
  }, 100); // Dopo questi secondo (add = aggiungo) la classe show alle precedenti classi aggiunte che ho riportato anche in CSS
  
  setTimeout(function() {
    toast.classList.remove("show"); //con il remove tolgo le classi
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 300); // per levare il toast del DOM quindi riga54
  }, 3000); // 3 secondi di visibilità del toast
}

profileDropdown.addEventListener('click', function() { // apre e chiude il menù utente
  dropdownNav.classList.toggle('is-expanded');
});
// Mostra il popup quando si clicca su "Delete Account"
deleteBtn.addEventListener('click', (e) => {
  e.preventDefault(); // Impedisce il comportamento predefinito del link
  // Mostra il popup
  deletePopup.style.display = 'flex';
});

// Chiudo il popup quando si clicca sul pulsante di chiusura (×)
closeDeletePopupBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none';
});

// Chiudo il popup quando si clicca sul pulsante "Cancel"
cancelDeleteBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none';
});

// Azione da eseguire quando si clicca su "Confirm"
confirmDeleteBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none'; // Chiudo il popup dopo aver confermato l'eliminazione
  localStorage.removeItem("username"); 
  localStorage.removeItem("password"); 
  localStorage.removeItem("moviesLaMiaLista")
  window.location.href = "/index.html"; // Reindirizzamento alla pagina index.html
});