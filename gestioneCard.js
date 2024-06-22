let moviesLaMiaLista = [];
const savedMoviesJSON = localStorage.getItem('moviesLaMiaLista');
if (savedMoviesJSON) {
  moviesLaMiaLista = JSON.parse(savedMoviesJSON);
}
export  function aggiungiFilm (movie) {
    if(!moviesLaMiaLista.find(savedMovie => savedMovie.id === movie.id)){ //così si cerca per id perchè in realtà JavaScript confronta gli oggetti per il loro riferimento, non per il contenuto dei loro campi.
      moviesLaMiaLista = [...moviesLaMiaLista,movie];
      localStorage.setItem('moviesLaMiaLista', JSON.stringify(moviesLaMiaLista));
    }
  }
  
  export function getListaFilm () {
    return moviesLaMiaLista;
  }
  
  export function deleteFilm (movie){
    if (moviesLaMiaLista.find(savedMovie => savedMovie.id === movie.id)){
      moviesLaMiaLista =  moviesLaMiaLista.filter(savedMovie => savedMovie.id !== movie.id);
      localStorage.setItem('moviesLaMiaLista', JSON.stringify(moviesLaMiaLista));
    }
  }