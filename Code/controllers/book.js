const libro = require("../models/book")
const counter = require("../models/counter")

const getAllBooks = async (req,res) => {
    libro.find({},(err,data)=>{
        if(data){
            if(data.length === 0){
                return res.status(404).json({success: false, message : "Nessun utente presente"})
            }
             // Map each book to required fields
             const books = data.map(libro => ({
              titolo : libro.titolo,
              Author_name : libro.Author_name,
              Author_sur : libro.Author_sur,
              Genre : libro.Genre,
              Is_available : libro.Is_available
          }));
          return res.status(200).json({ success: true, libri: books });
          } 
    })
  }


const Cancella_libro = async (req, res) => {
    let data =  await libro.findOne ({titolo : req.query.titolo}) .exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Libro non trovato"})
    } else {
        await libro.deleteOne({book_id : data.book_id});
        return res.status(200).send()
    }
}

// DONE, Swagger DONE
const Ricerca_libro = async (req, res) => {
    let query = {};
    // Aggiungi la ricerca per titolo se è fornito nella richiesta
    if (req.query.titolo) {
        query.titolo = req.query.titolo;
    }
    // Aggiungi la ricerca per author_sur se è fornito nella richiesta
    else if (req.query.Author_sur) {
        query.Author_sur = req.query.Author_sur;
    }
    else if (req.query.Author_name) {
        query.Author_name = req.query.Author_name;;
    }else {
        return res.status(400).json({success : false, message : "Nessun parametro inserito"})
    } 
    let data =  await libro.find(query).exec()
    const books = [];
    for (const book of data) {
        const { book_id, titolo, Author_name, Author_sur, Genre, Is_available } = book;
        books.push({
            book_id: book_id,
            titolo: titolo,
            Author_name: Author_name,
            Author_sur: Author_sur,
            Genre: Genre,
            Is_available: Is_available
        });
    };
    if (books.length === 0) {
        return res.status(404).json({success : false, message : "Libro non trovato"})
    } else {
        return res.status(200).json({success : true, message : "Libro trovato",libri : books});}
    };

    // DONE, Swagger DONE
    const Filter = async (req, res) => {
        try {
            var Query = {};
            // Aggiungi la ricerca per author_sur se è fornito nella richiesta
            if (req.query.Author_sur) {
                Query.Author_sur = req.query.Author_sur;
            }
            else if (req.query.Genre) {
                Query.Genre = req.query.Genre;
            }
            else {
                return res.status(400).json({ success: false, message: "Filtro non selezionato o errato" });
            }
            let data = await libro.find(Query).exec();
            if (data.length === 0) {
                return res.status(404).json({ success: false, message: "Nessun libro trovato" });
            } else {
                const books = [];
                for (let i = 0; i < data.length; i++) {
                    const book = data[i];
                    const bookObj = {
                        book_id: book.book_id,
                        titolo: book.titolo,
                        Author_name: book.Author_name,
                        Author_sur: book.Author_sur,
                        Genre: book.Genre,
                        Is_available: book.Is_available,
                        Grade: book.Grade
                    };
                    books.push(bookObj);
                }
                return res.status(200).json({ success: true, libri: books });
            }
        } catch (error) {
            return res.status(500)
        }
    }


module.exports = {
    getAllBooks,
    Cancella_libro,
    Ricerca_libro,
    Filter
};
