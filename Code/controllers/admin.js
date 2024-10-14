const utente = require("../models/utente");
const libro = require("../models/book");
const counter = require("../models/counter");
const multa = require("../models/multa");


// DONE
const getAllusers = async (req,res) => {
  utente.find({},(err,data)=>{
      if(data){
          if(data.length === 0){
              return res.status(404).json({success: false, message : "Nessun utente presente"})
          }
           // Map each book to required fields
           const utentes = data.map(utente => ({
            //utente_id: utente.utente_id,
            nome: utente.nome,
            cognome: utente.cognome,
            mail: utente.mail
        }));
        return res.status(200).json({ success: true, utente: utentes });
        } 
  })
}

// DONE, Swagger DONE
const newLibro = async (req, res) => {
  try {
      const existingBook = await libro.findOne({ titolo: req.body.titolo });
      if (existingBook) {
          return res.status(409).json({ success: false, message: "Libro già presente in archivio" });
      }

      let cd = await counter.findOneAndUpdate(
          { id: "autoval" },
          { $inc: { seq: 1 } },
          { new: true }
      );

      let seqId;
      if (cd == null) {
          const newVal = new counter({ id: "autoval", seq: 1 });
          await newVal.save();
          seqId = 1;
      } else {
          seqId = cd.seq;
      }

      const newLibro = new libro({
          book_id: seqId,
          titolo: req.body.titolo,
          Author_name: req.body.Author_name,
          Author_sur: req.body.Author_sur,
          Genre: req.body.Genre
      });

      const savedBook = await newLibro.save();
      return res.status(201).json({ success: true, message: 'Libro aggiunto', data: savedBook });
  } catch (error) {
      return res.status(500).json({ success : false , error: error.message });
  }
};

// DONE, Swagger DONE
const Multa = async (req, res) => {
    try {
        const user = await utente.findOne({mail: req.body.mail});
        if (!user) {
            return res.status(404).json({success: false, message: "Utente non trovato" });
        }

        var scadenzaMulta = new Date();
        scadenzaMulta.setMonth(scadenzaMulta.getMonth() + 1);

        var dd = String(scadenzaMulta.getDate()).padStart(2, '0');
        var mm = String(scadenzaMulta.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = scadenzaMulta.getFullYear();

        scadenzaMulta = yyyy + '-' + mm + '-' + dd;

        const newMulta = new multa({
            mail: req.body.mail,
            importo: req.body.importo,
            paga_entro: scadenzaMulta
        });
  
        const savedMulta = await newMulta.save();
        return res.status(201).json({ success: true, message: 'Multa creata', data: savedMulta });
    } catch (error) {
        return res.status(500).json({ success : false , error: error.message });
    }
  };


// A CHE SERVE??, Swagger DONE
const deleteUtente = async (req, res) => {
  let data =  await utente.findOne ({mail: req.query.mail}).exec()

  if (!data) {
      return res.status(404).json({success : false, message : "Utente non trovato"})
  } else {
      await utente.deleteOne({mail: data.mail});
      return res.status(200).json({success : true, message : "Utente eliminato"})
  }
}


module.exports = {
  getAllusers, 
  newLibro,
  Multa,
  deleteUtente
}