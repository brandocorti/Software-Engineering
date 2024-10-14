const libro = require("../models/book")
const utente = require("../models/utente");

const updateDisponibilita = async (req, res) => {
      // Attendere la promessa restituita da findOne()
      let book = await libro.findOne({ titolo: req.query.titolo }).exec();
      let user = await utente.findOne({ mail: req.query.mail }).exec();

      if(!book) {
          return res.status(404).json({ success: false, message: "Libro non trovato" });
      }
      if(!user) {
        return res.status(404).json({ success: false, message: "Utente non trovato" });
      }

      // Eseguire updateOne() con i dati da aggiornare
      await libro.updateOne({ titolo: book.titolo }, {
          $set: {
            Is_available: true,
            scadenza: null
          }
      });

      function rimuoviElemento(array, elementoDaRimuovere) {
        // Trova l'indice dell'elemento da rimuovere
        const indice = array.indexOf(elementoDaRimuovere);
        
        // Se l'elemento è presente nell'array, rimuovilo
        if (indice !== -1) {
            array.splice(indice, 1);
        }
        
        // Ritorna l'array modificato
        return array;
    }

      await utente.updateOne({ mail: user.mail }, {
        $set: {
          n_libri: user.n_libri - 1,
          libri_noleggiati: rimuoviElemento(user.libri_noleggiati, book.book_id)
        }
    });
    return res.status(200).json({ success: true, message: "Disponibilità aggiornata"});
};

module.exports = {
  updateDisponibilita
}