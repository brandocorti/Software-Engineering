// INIZIO HANDLER EVENTI
var archivioButton = document.getElementById("archivioButton");
archivioButton.addEventListener("click", function() {
  window.location.href = "archivio.html";
});

var searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    ricerca();
  }
});

document.getElementById("formAppuntamento").addEventListener("submit", function(event) {
  event.preventDefault();
  appuntamento();
});

function IsUserLoggedIn() {
  const loggedUserJSON = localStorage.getItem('loggedUser');
  return !!loggedUserJSON; // Restituisce true se l'utente è loggato, altrimenti false
}

function handle(e){
  input = document.getElementById("searchBar").value;
  if(e.keyCode === 13){
      console.log("Input: " + input);
      ricerca();
  }
  return false;
}
// FINE HANDLER EVENTI

// INIZIO FUNZIONI
var loggedUser = {};

// Funzione per creare un nuovo utente
function registrati(){ 
  const nome = document.getElementById('nomeRegistrazione').value;
  const cognome = document.getElementById('cognomeRegistrazione').value;
  const mail = document.getElementById('mailRegistrazione').value;
  const password = document.getElementById('passwordRegistrazione').value;
  const confermaPassword = document.getElementById('confermaPasswordRegistrazione').value;
  
  // Verifica che tutti i campi siano stati compilati
  if (!nome || !cognome || !mail || !password || !confermaPassword) {
    alert("Si prega di compilare tutti i campi.");
    return;
   }

  // Verifica che le password corrispondano
  if (password !== confermaPassword) {
      alert("Le password non corrispondono.");
      return;
  }

  let dati = {
      nome: nome,
      cognome: cognome,
      mail: mail,
      password: password
  }
  //console.log("dati: ", dati);

  fetch('../signUp', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
    window.location.href="homepage.html"
    return;
  })
  .catch(error => console.error(error)); // If there is any error you will catch them here
}

// funzione per far loggare un utente inserite le credenziali
function login() {
  const mail = document.getElementById('mailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  // Verifica che tutti i campi siano stati compilati
  if (!mail || !password) {
    alert("Si prega di compilare tutti i campi.");
    return;
  }

  fetch('../login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({mail: mail, password: password}),
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
    // Controlla se il login è riuscito
    if (data && data.token) {
      loggedUser = data;
      console.log(data.mail)
      // Salva i dati utente nella localStorage
      localStorage.setItem('loggedUser', JSON.stringify(data));
      if(data.mail === 'admin@easylib.com'){
        window.location.href= 'homepageAdmin.html'
      }
      else{
        window.location.href = 'homepage.html';
      }
    } else {
      alert("Credenziali non valide.");
    }
  })
  .catch(error => console.error(error));
}

// funzione per far fare il logout all'utente 
function logout() {
  fetch('../logout', {
    method: 'GET',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
    if (data && data.success) {
      // Rimuovi i dati utente dalla localStorage
      localStorage.removeItem('loggedUser');

      // reindirizza a homepage.html
      window.location.href = 'homepage.html';
    } else {
      alert("Errore durante il logout.");
    }
  })
  .catch(error => console.error(error));
}

// Inizio funzioni per mostrare pagina risultati (ricerca, filtro)
// ricercaPerParametro e ricercaPerFiltro servono a decidere quale parametro passare all'API
var books = {};
async function ricercaPerParametro(parametro) {
  var url = '../ricerca?' + parametro + '=' + String(input);
  console.log(url);
  try {
      const response = await fetch(url, {method : 'GET'});
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error during search:', error);
      throw error;
  }
}

async function ricercaPerFiltro(parametro, input) {
  var url = '../filter?' + parametro + '=' + String(input);
  console.log(url);
  try {
      const response = await fetch(url, {method : 'GET'});
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error during search:', error);
      throw error;
  }
}

async function ricerca() {
  var input = document.getElementById("searchBar").value;

  try {aggiungLibro
      // Effettua la ricerca per parametro=[titolo, nome, cognome]
      let res = await ricercaPerParametro('titolo');
      console.log(res);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Libro trovato: ", res);
          books = res;
          aggiungLibro(res.libri, IsUserLoggedIn());
          return books;
      }

      console.log("Titolo non trovato.");

      res = await ricercaPerParametro('Author_name');
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Nome dell'autore trovato: ", res);
          books = res;
          aggiungLibro(res.libri, IsUserLoggedIn());
          return books;
      }

      console.log("Nome autore non trovato");

      res = await ricercaPerParametro('Author_sur');
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Cognome dell'autore trovato: ", res);
          books = res;
          aggiungLibro(res.libri, IsUserLoggedIn());
          return books;
      }

      console.log("Nessun risultato trovato.");
  } catch (error) {
      console.error('Errore durante la ricerca:', error);
  }

  // If no books found, return an empty object
  return books;
}

async function filtri() {
  var input = document.querySelector('input[name="filtro"]:checked').value;

  try {aggiungLibro
      // Effettua la ricerca per parametro=[titolo, nome, cognome]
      let res = await ricercaPerFiltro('Genre', input);;
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Genere del libro trovato: ", res);
          aggiungLibro(res.libri, IsUserLoggedIn());
          return res;
      }

      console.log("Genere libro non trovato");

      res = await ricercaPerFiltro('Author_sur', input);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Cognome dell'autore trovato: ", res);
          aggiungLibro(res.libri, IsUserLoggedIn());
          return res;
      }

      console.log("Nessun risultato trovato.");
  } catch (error) {
      console.error('Errore durante il filtro:', error);
  }

  // If no books found, return an empty object
  return book;
}

// Funzione per creare dinamicamente la pagina dei risulati
function aggiungLibro(books, isLoggedIn) {
  var booksDiv = document.getElementById("bookList");
  if (!booksDiv) {
      console.error("Elemento 'bookList' non trovato.");
      return; // Esci dalla funzione se 'bookList' non è stato trovato
  }
  booksDiv.innerHTML = "";
  if (Array.isArray(books)){
    books.forEach(book => {
    
      var bookDiv = document.createElement('div');
      bookDiv.classList.add('book-section');

      var bookContainer = document.createElement('div');
      bookContainer.classList.add('book-container');

      var copertinaContainer = document.createElement('div');
      copertinaContainer.classList.add('copertina-container');

      var titoloP = document.createElement('div');
      titoloP.classList.add('titolo-libro');
      titoloP.textContent = book.titolo;

      var copertinaImg = document.createElement('img');
      copertinaImg.classList.add('copertina-libro');
      copertinaImg.src = "photos/" + book.titolo + ".jpeg";

      copertinaContainer.appendChild(titoloP);
      copertinaContainer.appendChild(copertinaImg);

      var infoLibro = document.createElement('div');
      infoLibro.classList.add('info-libro');

      var autoreP = document.createElement('p');
      autoreP.classList.add('autore');
      autoreP.innerHTML = 'di <strong>' + book.Author_name + " " + book.Author_sur + '</strong>';

      var genereP = document.createElement('p');
      genereP.classList.add('genere');
      genereP.textContent = "Genere: " + book.Genre;

      var disponibilitaP = document.createElement('p'); 
      disponibilitaP.classList.add('disponibilità'); 
      if(book.Is_available){
        disponibilitaP.innerHTML = '<span class="cerchio-verde"></span> Disponibile'; 
      }
      else{
        disponibilitaP.innerHTML = '<span class="cerchio-rosso"></span> Non disponibile'; 
      }
      
      
      var prenotaButton = document.createElement('button');
      prenotaButton.classList.add('bottone-prenota');
      prenotaButton.textContent = "Prenota e ritira";
      // Controllo se l'utente è loggato per mostrare il pulsante
      prenotaButton.style.display = isLoggedIn ? "block" : "none";

      infoLibro.appendChild(autoreP);
      infoLibro.appendChild(genereP);
      infoLibro.appendChild(disponibilitaP); 

      // Aggiungi il pulsante solo se il libro è disponibile
      if (book.Is_available && isLoggedIn) {
        var prenotaButton = document.createElement('button');
        prenotaButton.classList.add('bottone-prenota');
        prenotaButton.textContent = "Prenota e ritira";

        // Aggiungi un event listener al bottone Prenota e ritira
        prenotaButton.addEventListener("click", function(){
          // Costruisci l'URL con il titolo del libro come parametro
          window.location.href = "appuntamentoLibro.html?titolo=" + encodeURIComponent(book.titolo) + "&book_id=" + encodeURIComponent(book.book_id);
        });

        infoLibro.appendChild(prenotaButton);
      }
          
      
      bookContainer.appendChild(copertinaContainer);
      bookContainer.appendChild(infoLibro);

      bookDiv.appendChild(bookContainer);
      booksDiv.appendChild(bookDiv);

      // Aggiungi un event listener a ciascun bottone Prenota e ritira
      prenotaButton.addEventListener("click", function(){
        // Costruisci l'URL con il titolo del libro come parametro
        window.location.href = "appuntamentoLibro.html?titolo=" + encodeURIComponent(book.titolo) + "&book_id=" + encodeURIComponent(book.book_id);
      });
    });
  }
}


// funzione che una volta prenotato l'appuntamento 'prenotazione' aggiorna disponibilità 
// del libro noleggiato a false
function noleggio(mailUtente, titoloLibro){
  // // Recupera il titolo del libro dal parametro dell'URL
  // const urlParams = new URLSearchParams(window.location.search);
  // const book_id = urlParams.get('book_id');

  let dati = {
    titolo: titoloLibro,
    mail: mailUtente,
  };

  console.log(dati);

  fetch('../Rented', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
          console.log('Libro prenotato correttamente')
      }
      else{
          console.log('Libro non prenotato');
      }
      return;
  })
  .catch(error => console.error(error));
};

// funzione per creare un appuntamento per ritirare un libro
function prenotazione() {
  // Recupera il titolo del libro dal parametro dell'URL
  const urlParams = new URLSearchParams(window.location.search);
  const titolo = urlParams.get('titolo');
  if (!titolo) {
      console.error("Titolo del libro non trovato nei parametri dell'URL.");
      return;
  }

  // Recupera gli altri dati del form
  const mail = document.getElementById('emailAppuntamento').value;
  const data = document.getElementById('dateAppuntamento').value;
  const ora = document.getElementById('timeAppuntamento').value;

  // Costruzione dei dati nel formato corretto per lo schema MongoDB
  let dati = {
      titolo: titolo,
      mail: mail,
      data: new Date(`${data}T${ora}`),
      tipo_app: "Ritirare un libro: " + titolo,
  };

  console.log("dati: ", dati);

  fetch('../createApp', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
        alert("Prenotazione effettuata");
        noleggio(mail, titolo);
      }
      else{
          alert("Prenotazione non effettuata");
      }
      return;
  })
  .catch(error => console.error(error));
}

// funzione per prenotare un appuntamento di tipo donazione o restituire un libro
function appuntamento() {
  const mail = document.getElementById('emailAppuntamento').value;
  const data = document.getElementById('dateAppuntamento').value;
  const ora = document.getElementById('timeAppuntamento').value;
  const tipoAppuntamento = document.querySelector('input[name="fav_language"]:checked').value;

  if(!tipoAppuntamento) {
    alert("Seleziona un appuntamento!!")
  }
  // Costruzione dei dati nel formato corretto per lo schema MongoDB
  let dati = {
    mail: mail,
    data: new Date(`${data}T${ora}`), // Combina data e ora
    tipo_app: tipoAppuntamento
  };
  
  console.log("dati: ", dati);

  fetch('../createApp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
    if(data.success){
      alert("Appuntamento Prenotato");
    }
    else{
      alert("Appuntamento non prenotato");
    }
    return;
  })
  .catch(error => console.error(error));
};

// funzione per ottenere i miei noleggi
function ottieniNoleggi(){
  const loggedUserJSON = localStorage.getItem('loggedUser');
  const loggedUser = JSON.parse(loggedUserJSON)
  const mail = loggedUser.mail

  console.log('mail: ', mail);

  fetch('../arrayLibri?mail=' + mail)
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data.libri);
      iMieiNoleggi(data.libri)
    }
    return;
  })
  .catch(error => console.error(error));
};

// funzione per creare dinamicamente la pagina i miei noleggi
function iMieiNoleggi(books) {
  console.log('books: ', books)
  var booksDiv = document.getElementById("bookList");
  if (!booksDiv) {
      console.error("Elemento 'bookList' non trovato.");
      return; // Esci dalla funzione se 'bookList' non è stato trovato
  }
  booksDiv.innerHTML = "";
  if (Array.isArray(books) && books.length > 0) {
    books.forEach(book => {
    
      var bookDiv = document.createElement('div');
      bookDiv.classList.add('book-section');

      var bookContainer = document.createElement('div');
      bookContainer.classList.add('book-container');

      var copertinaContainer = document.createElement('div');
      copertinaContainer.classList.add('copertina-container');

      var titoloP = document.createElement('div');
      titoloP.classList.add('titolo-libro');
      titoloP.textContent = book.titolo;

      var copertinaImg = document.createElement('img');
      copertinaImg.classList.add('copertina-libro');
      copertinaImg.src = "photos/" + book.titolo + ".jpeg";

      copertinaContainer.appendChild(titoloP);
      copertinaContainer.appendChild(copertinaImg);

      var infoLibro = document.createElement('div');
      infoLibro.classList.add('info-libro');

      var autoreP = document.createElement('p');
      autoreP.classList.add('autore');
      autoreP.innerHTML = 'di <strong>' + book.Author_name + " " + book.Author_sur + '</strong>';

      var genereP = document.createElement('p');
      genereP.classList.add('genere');
      genereP.textContent = "Genere: " + book.Genre;

      var prenotaButton = document.createElement('button');
      prenotaButton.classList.add('bottone-cancella');
      prenotaButton.textContent = "Termina Prenotazione";

      infoLibro.appendChild(autoreP);
      infoLibro.appendChild(genereP);
      infoLibro.appendChild(prenotaButton);      
      
      bookContainer.appendChild(copertinaContainer);
      bookContainer.appendChild(infoLibro);

      bookDiv.appendChild(bookContainer);
      booksDiv.appendChild(bookDiv);

      // Aggiungi un event listener a ciascun bottone Prenota e ritira
      prenotaButton.addEventListener("click", function(){
        // Costruisci l'URL con il titolo del libro come parametro
        window.location.href = "appuntamentoRestituisci.html?titolo=" + encodeURIComponent(book.titolo);
      });
    });
  }
}

function restituisci(){
    const mail = document.getElementById('emailAppuntamento').value;
    const data = document.getElementById('dateAppuntamento').value;
    const ora = document.getElementById('timeAppuntamento').value;
  
    // Costruzione dei dati nel formato corretto per lo schema MongoDB
    let dati = {
      mail: mail,
      data: new Date(`${data}T${ora}`), // Combina data e ora
      tipo_app: 'Restituire un libro'
    };
    
    console.log("dati: ", dati);
  
    fetch('../createApp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
    })
    .then((res) => res.json()) 
    .then(function(data) { 
      if(data.success){
        alert("Appuntamento Prenotato");
      }
      else{
        alert("Appuntamento non prenotato");
      }
      return;
    })
    .catch(error => console.error(error));
  };


// funzione per ottenere gli appuntamenti di un utente
function fetchAppuntamenti(){
  const loggedUserJSON = localStorage.getItem('loggedUser');
  const loggedUser = JSON.parse(loggedUserJSON)
  const mail = loggedUser.mail

  fetch('../getAppuntamento?mail=' + mail)
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data.appointment);
      renderAppuntamenti(data.appointment)
    }
    return;
  })
  .catch(error => console.error(error));
}

// Funzione per formattare la data
function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', options);
}

// Funzione per creare sezione 'i miei appuntamenti'
function renderAppuntamenti(appuntamenti) {
  const appuntamentiDiv = document.getElementById('appuntamentiList');
  if (!appuntamentiDiv) {
    console.error("Elemento 'appuntamentiList' non trovato.");
    return; // Esci dalla funzione se 'bookList' non è stato trovato
}
  appuntamentiDiv.innerHTML = "";
  const divAppuntamenti = document.createElement('div');
  divAppuntamenti.className = 'appuntamenti';

  const ul = document.createElement('ul');

  appuntamenti.forEach(appuntamenti => {
    const li = document.createElement('li');
    li.innerHTML = `
      <p class="giorno"><strong>Data: </strong>${formatDate(appuntamenti.data)}</p>
      <p class="orario"><strong>Orario: </strong>${new Date(appuntamenti.data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
      <p class="descrizioneAppuntamento"><strong>Tipo Appuntamento: </strong> ${appuntamenti.tipo_app} </p>
      <button class="cancella-appuntamento">Cancella appuntamento</button>
    `;
    ul.appendChild(li);
  });

  divAppuntamenti.appendChild(ul);

  appuntamentiDiv.appendChild(divAppuntamenti);

    // Aggiungi un event listener a ciascun bottone cancella appuntamento
    var cancellaButtons = document.querySelectorAll('.cancella-appuntamento');
    cancellaButtons.forEach(function(button) {
    button.addEventListener("click", function(){
        // Costruisci l'URL con il titolo del libro come parametro
        deleteAppuntamenti();
    });
});
}

function deleteAppuntamenti(){
  const loggedUserJSON = localStorage.getItem('loggedUser');
  const loggedUser = JSON.parse(loggedUserJSON)
  const mail = loggedUser.mail

  console.log(mail)

  fetch('../deleteAppuntamento?mail=' + mail, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((res) => res.json())
  .then(function(data){
    if(data){
      alert("Appuntamento eliminato")

      window.location.reload();
    }
    return;
  })
  .catch(error => console.error(error));
};

// funzione per ottenere le multe
function fetchMulta(){
  const loggedUserJSON = localStorage.getItem('loggedUser');
  const loggedUser = JSON.parse(loggedUserJSON)
  const mail = loggedUser.mail

  fetch('../getMulta?mail=' + mail)
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data.multe);
      renderMulta(data.multe)
    }
    return;
  })
  .catch(error => console.error(error));
}

// Funzione per creare sezione 'Multe'
function renderMulta(multa) {
  const multaDiv = document.getElementById('pagamentiList');
  if (!multaDiv) {
    console.error("Elemento 'multaList' non trovato.");
    return; // Esci dalla funzione se 'bookList' non è stato trovato
}
  multaDiv.innerHTML = "";
  const divMulta = document.createElement('div');
  divMulta.className = 'pagamenti';

  const ul = document.createElement('ul');

  multa.forEach(multa => {
    const li = document.createElement('li');
    li.innerHTML = `
      <p class="giorno"><strong>Paga entro: </strong>${formatDate(multa.paga_entro)}</p>
      <p class="descrizione"><strong>Motivazione: </strong>Libro non restituito in tempo </p>
      <span class="importo">€ ${multa.importo}</span>
    `;
    ul.appendChild(li);
  });

  divMulta.appendChild(ul);

  multaDiv.appendChild(divMulta);
}


// funzione che ottiene tutti gli utenti
function fetchUtenti(){
  fetch('../getAll')
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data);
      renderUtenti(data.utente);
    }
    return;
  })
  .catch(error => console.error(error));
}

// Funzione per creare sezione 'utenti' parte admin
function renderUtenti(utenti) {
  const utentiDiv = document.getElementById('utentiList');
  if (!utentiDiv) {
    console.error("Elemento 'utentiList' non trovato.");
    return;
  }
  utentiDiv.innerHTML = "";
  const divUtenti = document.createElement('div');
  divUtenti.className = 'utenti';

  const ul = document.createElement('ul');

  utenti.forEach(utente => {
    const li = document.createElement('li');
    li.innerHTML = `
      <p class="nome"><strong>Nome: </strong>${utente.nome}</p>
      <p class="cognome"><strong>Cognome: </strong>${utente.cognome}</p>
      <p class="mail"><strong>Mail: </strong> ${utente.mail} </p>
      <button class="conferma-reso" data-mail="${utente.mail}">Apri pagina noleggi</button>
      <button class="bottone-multa" data-mail="${utente.mail}">Apri pagina multe</button>
    `;
    ul.appendChild(li);
  });

  divUtenti.appendChild(ul);
  utentiDiv.appendChild(divUtenti);

  // Aggiungi un event listener a ciascun bottone 'conferma-reso'
  const confermaButtons = document.querySelectorAll('.conferma-reso');
  confermaButtons.forEach(function(button) {
    button.addEventListener("click", function(){
      // Ottieni l'email dall'attributo data-mail
      const userMail = this.getAttribute('data-mail');
      // Costruisci l'URL con l'email come parametro
      window.location.href = 'paginaNoleggi.html?mail=' + userMail;
    });
  });
  // Aggiungi un event listener a ciascun bottone 'conferma-reso'
  const multaButtons = document.querySelectorAll('.bottone-multa');
  multaButtons.forEach(function(button) {
    button.addEventListener("click", function(){
      // Ottieni l'email dall'attributo data-mail
      const userMail = this.getAttribute('data-mail');
      // Costruisci l'URL con l'email come parametro
      window.location.href = 'paginaMulta.html?mail=' + userMail;
    });
  });
}


// funzione che aggiorna la disponibilità di un libro a true
function updateDisponibilita(mailUtente, titoloLibro){

  console.log('mail: ', mailUtente);
  console.log('titolo: ', titoloLibro);

  fetch('../disponibilita?mail=' + mailUtente + '&titolo=' + titoloLibro , {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
      }
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
          console.log('disponibilità aggiornata')
          window.location.reload();
      }
      else{
          console.log('disponibilità non aggiornata');
      }
      return;
  })
  .catch(error => console.error(error));
}


// funzione per ottenere i miei noleggi
function fetchNoleggi(){
  // Recupera il titolo del libro dal parametro dell'URL
  const urlParams = new URLSearchParams(window.location.search);
  const mail = urlParams.get('mail');
  if (!mail) {
    console.error("Mail dell'utente non trovato nei parametri dell'URL.");
    return;
  }

  console.log('mail: ', mail);

  fetch('../arrayLibri?mail=' + mail)
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data.libri);
      renderNoleggi(data.libri)
    }
    return;
  })
  .catch(error => console.error(error));
};


// funzione che renderizza la pagina 'utenti'
function renderNoleggi(books){
  // Recupera la mail dell'utente dal parametro dell'URL
  const urlParams = new URLSearchParams(window.location.search);
  const mail = urlParams.get('mail');
  if (!mail) {
    console.error("Mail dell'utente non trovato nei parametri dell'URL.");
    return;
  }

  console.log('books: ', books)
  var booksDiv = document.getElementById("bookList");
  if (!booksDiv) {
    console.error("Elemento 'bookList' non trovato.");
    return; // Esci dalla funzione se 'bookList' non è stato trovato
  }
  booksDiv.innerHTML = "";
  if (Array.isArray(books) && books.length > 0) {
    books.forEach(book => {
    
      var bookDiv = document.createElement('div');
      bookDiv.classList.add('book-section');

      var bookContainer = document.createElement('div');
      bookContainer.classList.add('book-container');

      var copertinaContainer = document.createElement('div');
      copertinaContainer.classList.add('copertina-container');

      var titoloP = document.createElement('div');
      titoloP.classList.add('titolo-libro');
      titoloP.textContent = book.titolo;

      var copertinaImg = document.createElement('img');
      copertinaImg.classList.add('copertina-libro');
      copertinaImg.src = "photos/" + book.titolo + ".jpeg";

      copertinaContainer.appendChild(titoloP);
      copertinaContainer.appendChild(copertinaImg);

      var infoLibro = document.createElement('div');
      infoLibro.classList.add('info-libro');

      var autoreP = document.createElement('p');
      autoreP.classList.add('autore');
      autoreP.innerHTML = 'di <strong>' + book.Author_name + " " + book.Author_sur + '</strong>';

      var genereP = document.createElement('p');
      genereP.classList.add('genere');
      genereP.textContent = "Genere: " + book.Genre;

      var confermaResoButton = document.createElement('button');
      confermaResoButton.classList.add('bottone-cancella');
      confermaResoButton.textContent = "Conferma reso";

      infoLibro.appendChild(autoreP);
      infoLibro.appendChild(genereP);
      infoLibro.appendChild(confermaResoButton);      
      
      bookContainer.appendChild(copertinaContainer);
      bookContainer.appendChild(infoLibro);

      bookDiv.appendChild(bookContainer);
      booksDiv.appendChild(bookDiv);

      // Aggiungi un event listener a ciascun bottone Prenota e ritira
      confermaResoButton.addEventListener("click", function(){
        // Costruisci l'URL con il titolo del libro come parametro
        updateDisponibilita(mail, book.titolo);
      });
    });
  }
}

function newLibro(){
  const titolo = document.getElementById('titoloLibro').value;
  const nome = document.getElementById('nomeAutore').value;
  const cognome = document.getElementById('cognomeAutore').value;
  const genere = document.getElementById('genereLibro').value;

  dati = {
    titolo: titolo,
    Author_name: nome,
    Author_sur: cognome,
    Genre: genere
  }

  console.log(dati);

  fetch('../newLibro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
          console.log('Libro aggiunto al database')
      }
      else{
          console.log('errore, nessun libro aggiunto al database');
      }
      return;
  })
  .catch(error => console.error(error));
};

function creaMulta(){
  const mail = document.getElementById('mailUtente').value;
  const importo = document.getElementById('importoMulta').value;

  dati = {
   mail: mail,
   importo: importo
  }

  console.log(dati);

  fetch('../Multa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
          console.log('multa creata')
      }
      else{
          console.log('errore, nessuna multa creata');
      }
      return;
  })
  .catch(error => console.error(error));
}

function fetchBooks(){
  fetch('../getAllBooks')
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data);
      aggiungLibro(data.libri, IsUserLoggedIn());
    }
    return;
  })
  .catch(error => console.error(error));
}