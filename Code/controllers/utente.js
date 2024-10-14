const utente = require("../models/utente")
const libro = require("../models/book")
const counter = require("../models/counter")
const aux = require("../auxiliares/check")
const appuntamento = require("../models/appuntamento")
const multa  = require("../models/multa");
const { request } = require("express")

// DONE, Swagger DONE
const signUp = async (req, res) => {
    utente.findOne({mail: req.body.mail}, (err, data) => {
        if(!data){
            counter.findOneAndUpdate(
                {id: "autoval"},
                {"$inc": {"seq": 1}},
                {new: true}, (err, cd) => {
            
                  let seqId;
                  if(cd==null){
                    const newVal = new counter({id: "autoval", seq: 1})
                    newVal.save();
                    seqId = 1
                  }
                  else{
                    seqId = cd.seq
                  }
                  const newUtente = new utente({
                    utente_id : seqId,
                    nome : req.body.nome,
                    cognome : req.body.cognome,
                    mail : req.body.mail,
                    password : req.body.password,
                  })

                if(!aux.validateEmail(newUtente.mail)){
                    res.status(400).json({ error: 'Email non valida' });
                    return;
                }
                if(!aux.checkPw(newUtente.password)){ {
                    res.status(400).json({ error: 'Password non valida' });
                    return;
                    }
                }

                newUtente.save((err, data) => {
                    if (err) return res.status(500).json({success : false, Error: err});
                    return res.status(201).json({success: true, message: "Utente creato con successo!", data});
                })
                }
            )
        }
        else {
            return res.status(409).json({success : false, message:"Utente già presente con questa mail!"});
        }
    })
}

function compareDates(a){
    var today = new Date();

    
    var b; 
    
    b =new Date(a);

    if(b < today){
        return false;
    } else {
        return true;
    }
}

// DONE
const createApp = async(req, res) => {
    let data_u = await utente.findOne ({mail: req.body.mail}).exec()
    if (!data_u){
        return res.status(404).json({success : false, message:"Utente non trovato"});
    }
    const newAppuntamento = new appuntamento({
        mail: data_u.mail,
        data: req.body.data,
        tipo_app: req.body.tipo_app
    })

    if(!compareDates(req.body.data)){
        return res.status(400).json({ success: false, message: "Data non valida" });
   }

        newAppuntamento.save((err,data)=>{
            if (err){
                return res.status(500).json({success: false, message:"Errore del server"})
            } else {
                return res.status(200).json({success: true, message: "Appuntamento creato", data})
            }
        }) 
    }

// DONE, Swagger DONE
const deleteApp = async (req, res) => {
    let data =  await appuntamento.findOne ({mail: req.query.mail}).exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Appuntamento non trovato"})
    } else {
        await appuntamento.deleteOne({mail : data.mail});
        return res.status(200).json({success : true, message : "Appuntamento cancellato con successo"})
    }
}


const getBooks = async (req, res) => {
    try {
        let data = await utente.findOne({ mail: req.query.mail }).exec();

        if (!data) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }

        var libri = [];
        var l = {
            libri_noleggiati: data.libri_noleggiati
        };
        for (let i = 0; i < l.libri_noleggiati.length; i++) {
            let element = l.libri_noleggiati[i];
            let faa = await libro.findOne({ 'book_id': element }).exec();
        
            var p = {
                book_id: faa.book_id,
                titolo: faa.titolo,
                Author_name: faa.Author_name,
                Author_sur: faa.Author_sur,
                Genre: faa.Genre,
                scadenza: faa.scadenza
            };
        
            libri.push(p);
        }

        return res.status(200).json({libri });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Errore del server" });
    }
}

// DONE, Swagger DONE
const RentedBooks = async (req, res) => {
    try {
        // Attendere la promessa restituita da findOne()
        let user = await utente.findOne({ mail: req.body.mail }).exec();
        let book = await libro.findOne({titolo: req.body.titolo}).exec();
        var t ;

        var scadenzaNoleggio = new Date();
        scadenzaNoleggio.setMonth(scadenzaNoleggio.getMonth() + 1);

        var dd = String(scadenzaNoleggio.getDate()).padStart(2, '0');
        var mm = String(scadenzaNoleggio.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = scadenzaNoleggio.getFullYear();

        scadenzaNoleggio = yyyy + '-' + mm + '-' + dd;
        
        if (!book){ 
            return res.status(404).json({ success: false, message: "Libro non trovato" });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }else if (user.n_libri >= 5){
            return res.status(400).json({ success: false, message: "Hai raggiunto il limite di libri noleggiati" });
        } 

        if(!book.Is_available){
            return res.status(400).json({ success: false, message: "Libro non disponibile" });
        }
        
        else {
            t = {
                libri_noleggiati: user.libri_noleggiati,
                n_libri : user.n_libri
            }
            t.libri_noleggiati.push(book.book_id)
        // Eseguire updateOne() con i dati da aggiornare
            await utente.updateOne({ mail: req.body.mail }, {
                $set: {
                    libri_noleggiati: t.libri_noleggiati,
                    n_libri : t.n_libri + 1
                }
        });
            await libro.updateOne({titolo: req.body.titolo}, {
                $set: {
                    scadenza: scadenzaNoleggio,
                    Is_available: false
                }
        });

        return res.status(200).json({ success: true, message: "Libro aggiunto" });
    }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Errore interno del server" });
    }
};

// DONE, Swagger DONE
const getMulta = async (req, res) => {
    let multe = await multa.find({mail: req.query.mail}).exec();
    
    if(multe.length === 0){
        return res.status(404).json({ success: false, message: "Utente non ha una multa" });
    }
    else{
        return res.status(200).json({ success: true, message: "Multa trovata", multe});
    }
}

// DONE, Swagger DONE
const getAppuntamenti = async (req, res) => {
    let appointment = await appuntamento.find({mail: req.query.mail}).exec();
    if(!appointment ||appointment.length === 0){
        return res.status(404).json({ success: false, message: "Appuntamento non trovato" });
    }
    else{
        return res.status(200).json({ success: true, message: "Appuntamento trovato", appointment });
    }
}

module.exports = {
   deleteApp, 
   getBooks,
   signUp,
   RentedBooks,
   createApp,
   getMulta,
   getAppuntamenti,
};