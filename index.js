const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const emailRegistrazione = document.querySelector("#emailRegistrazione");
const buttonAccediBtn = document.getElementById('buttonAccedi');
const passwordRegistrazione = document.querySelector("#passwordRegistrazione");
const passwordRegistrazioneConfirm = document.querySelector("#passwordRegistrazioneConfirm");
const emailLoginEl = document.querySelector("#emailLogin");
const passwordLoginEl = document.querySelector("#passwordLogin");


loginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');//rimuovo il nascosto al Login del form
    registerForm.classList.add('hidden');//aggiungo il nascosto alla registrazione del secondo form
    loginBtn.classList.add('active');//attivo bottone di login
    registerBtn.classList.remove('active');//disattivo il bottone di registrazione 
});

registerBtn.addEventListener('click', () => { //questa funzione è il contrario
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginBtn.classList.remove('active');
    registerBtn.classList.add('active');
});

registerForm.addEventListener("submit",  e => {
    const password1 = passwordRegistrazione.value.trim(); // leva spazi
    const password2 = passwordRegistrazioneConfirm.value.trim();
    // Controllo se le password non corrispondono
    if (password1 !== password2) {
        // Mostra un messaggio di errore
        showToast("Passwords do not match. Please try again.", true);
        e.preventDefault(); // Impedisce l'invio del form
        return;
    } else if (password1.length < 6) {
        // Mostra un messaggio di errore
        showToast("Password must be at least 6 characters long. Please try again.", true);
        e.preventDefault(); // Impedisce l'invio del form
        return;
    }
    if (!registerForm.checkValidity())  {
        // Se il form non è valido, lascio che la validazione HTML5 gestisca l'errore
        return;
    } else {
        e.preventDefault(); //viene utilizzata in JavaScript per prevenire evento
        localStorage.setItem('username', emailRegistrazione.value);
        localStorage.setItem('password', passwordRegistrazione.value);
        showToast("Registration successful!");
        setTimeout(function() {
            window.location.href = "./home/home.html";
        }, 2000); // 2 secondi di ritardo        
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
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.classList.add("show");
    }, 100); // Dopo questi secondo (add = aggiungo) la classe show alle precedenti classi aggiunte che ho riportato anche in CSS
    
    setTimeout(function() {
        toast.classList.remove("show"); //con il remove tolgo le classi
        setTimeout(function() {
            document.body.removeChild(toast);
        }, 300); // per levare il toast del DOM quindi riga54
    }, 3000); // 3 secondi di visibilità del toast
}

buttonAccediBtn.addEventListener('click', e => {
    if (!loginForm.checkValidity())  {
        // Se il form non è valido, lascio che la validazione HTML5 gestisca l'errore
        return;
    } else {
        e.preventDefault(); //viene utilizzata in JavaScript per prevenire evento
        const usernameLocal = localStorage.getItem('username');
        const passwordLocal = localStorage.getItem('password');
        if(usernameLocal === emailLoginEl.value && passwordLocal === passwordLoginEl.value){
            showToast("Login successful!");
            setTimeout(function() {
                window.location.href = "./home/home.html";
            }, 2000); // 2 secondi di ritardo      
        } else {
            showToast("Incorrect Login",true)
        }
        
    }
});
