import { aggiungiFilm, getListaFilm, deleteFilm } from '../gestioneCard.js';

const containerLaMiaListaEl = document.getElementById("card-container-lamialista");
const popup = document.getElementById('popup');
const popupContent = document.querySelector('.popup-content');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const votoMedio = document.getElementById("votoMedio");
const searchBarFilmEl = document.getElementById('searchBarFilm');
const errorFilm = document.getElementById('error-film');
const deleteBtn = document.getElementById('deleteBtn');
const deletePopup = document.getElementById('deleteAccountPopup');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const closeDeletePopupBtn = document.getElementById('closeDeletePopup');

let moviesLaMiaLista = [];
moviesLaMiaLista = getListaFilm();

const displayMovies = (movies) => {
  containerLaMiaListaEl.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
      <h3>${movie.title}</h3>
      <p>${movie.overview}</p>
    `;
    movieCard.addEventListener('click', () => showPopup(movie));
    containerLaMiaListaEl.appendChild(movieCard);
  });
};


displayMovies(moviesLaMiaLista);

if(moviesLaMiaLista.length === 0){
  searchBarFilmEl.style.display = 'none';
  const message = document.createElement('p');
  message.innerText = "There are no movies in this list";
  message.style.color = "white";
  containerLaMiaListaEl.appendChild(message);
}


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
    showToast("You have removed the movie from your list!");
  });
  
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('fas'); // Cambia lo stile per indicare "mi piace"
    likeIcon.classList.toggle('far');
  });
  
  dislikeIcon.addEventListener('click', () => {
    dislikeIcon.classList.toggle('fas'); // Cambia lo stile per indicare "non mi piace"
    dislikeIcon.classList.toggle('far');
  });
  
  // Aggiungo le icone al container delle azioni
  newActionsContainer.appendChild(saveIcon);
  newActionsContainer.appendChild(removeIcon);
  newActionsContainer.appendChild(likeIcon);
  newActionsContainer.appendChild(dislikeIcon);
  
  // Aggiungo il container delle azioni al popup
  popupContent.appendChild(newActionsContainer);
  
  // Mostra il popup
  popup.style.display = "flex";
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
    
    popup.style.display = 'none';
    moviesLaMiaLista = getListaFilm()
    displayMovies(moviesLaMiaLista);
    if(moviesLaMiaLista.length === 0){
      searchBarFilmEl.style.display = 'none';
      const message = document.createElement('p');
      message.innerText = "There are no movies in this list";
      message.style.color = "white";
      containerLaMiaListaEl.appendChild(message);
    }
  }, 100); // Dopo questi secondo (add = aggiungo) la classe show alle precedenti classi aggiunte che ho riportato anche in CSS
  
  setTimeout(function() {
    toast.classList.remove("show"); //con il remove tolgo le classi
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 300); // per levare il toast del DOM quindi riga54
  }, 3000); // 3 secondi di visibilità del toast
}


// Evento click per la X
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});


window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
  }  else if (event.target === deletePopup) {
    deletePopup.style.display = 'none';
  }
});

const scrollToTop = () => {
  window.scrollTo({
    top: 600,
    behavior: 'smooth' // Comportamento di scorrimento dolce
  });
};


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


searchBarFilmEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (searchBarFilmEl.value){
      if (searchBarFilmEl.value.length > 3){
        displayMovies(moviesLaMiaLista.filter (data => data.title.toLowerCase().includes(searchBarFilmEl.value.toLowerCase()))); // diversamente dal === ho deciso di usare .includes per includere una parte di solo quello che scrive l'utente
        errorFilm.style.display = 'none';
      }
      else{
        errorFilm.style.display = 'block';
      }
    } else {
      displayMovies(moviesLaMiaLista);
    }
  }
});

// Mostro il popup quando si clicca su "Delete Account"
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

// Azioni da eseguire quando si clicca su "Confirm"
confirmDeleteBtn.addEventListener('click', () => {
  deletePopup.style.display = 'none'; // Chiudo il popup dopo aver confermato l'eliminazione
  localStorage.removeItem("username"); 
  localStorage.removeItem("password"); 
  localStorage.removeItem("moviesLaMiaLista")
  window.location.href = "/index.html"; // Reindirizzamento alla pagina index.html
});