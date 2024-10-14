const {default : mongoose} = require('mongoose');
const request = require('supertest');
require('dotenv').config();

const app = require('../server');
const jwt = require('jsonwebtoken');
const { unchangedTextChangeRange } = require('typescript');
let server = app.listen(process.env.PORT || 8080);

module.exports = {
    setupFilesAfterEnv : ['./jest.setup.js']
}
beforeAll(async () => {
    jest.setTimeout(30000)
    app.locals.db = mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    mongoose.connection.close();
    server.close();
});

var dataValida = new Date();
dataValida.setDate(dataValida.getDate() );
dataValida.setHours(dataValida.getHours() + 1);
dataValida.setMonth(dataValida.getMonth() );
dataValida.setFullYear(dataValida.getFullYear());

var dataNonValida = new Date();
dataNonValida.setDate(dataValida.getDate()-1);
dataNonValida.setHours(dataValida.getHours() + 1);
dataNonValida.setMonth(dataValida.getMonth() -1);
dataNonValida.setFullYear(dataValida.getFullYear());

describe('suite testing API endpoint "/getBooks"', () => {

    test('Chiamata API corretta', async () => {
        jest.setTimeout(30000);
        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita

        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();
        // Per ora i libri sono senza scadenza, TO DO : completati i test con scadenza  
        const libri =  [
            {
                book_id: 831,
                titolo: 'Libro prova 1',
                Author_name: 'Autore',
                Author_sur: 'Prova',
                Genre: 'Giallo',
                scadenza: '2024-06-18T00:00:00.000Z'
            },
            {
                book_id: 832,
                titolo: 'Libro prova 2',
                Author_name: 'Autore',
                Author_sur: 'Prova',
                Genre: 'Fantascienza',
                scadenza: '2024-06-18T00:00:00.000Z'
            },
            {
                book_id: 833,
                titolo: 'Libro prova 3',
                Author_name: 'Autore',
                Author_sur: 'Prova',
                Genre: 'Storia',
                scadenza: '2024-06-18T00:00:00.000Z'
            },
            {
                book_id: 834,
                titolo: 'Libro prova 4',
                Author_name: 'Autore',
                Author_sur: 'Prova',
                Genre: 'Dramma',
                scadenza: '2024-06-19T00:00:00.000Z'
            }
        ];
        const outputBody = {libri};
        const res = await request(app)
        .get('/arrayLibri')
        .query({
            mail : 'utenteprova@gmail.com'
        })
        .expect(200);
        expect(res.body).toEqual(outputBody);
    });

    test('Chiamata API con utente non esistente', async () => {
        jest.setTimeout(30000);
        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita

        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        const libri =  [
        ];
        const outputBody = {libri};
        const res = await request(app)
        .get('/arrayLibri')
        .query({
            mail : 'nonesisto@gmail.com'
        })
        .expect(404);
        expect(res.body.message).toBe('Utente non trovato');
    });

    test('Chiamata API con array libri vuoto', async () => {
        jest.setTimeout(30000);
        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita

        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        const libri =  [
        ];
        const outputBody = {libri};
        const res = await request(app)
        .get('/arrayLibri')
        .query({
            mail : 'Test2@gmail.com'
        })
        .expect(200);
        expect(res.body).toEqual(outputBody);
    });
})

describe('suite testing API endpoint "/ricerca"', () => {

    test('Chiamata API corretta con ricerca per cognome autore', async () => {
        
        //ricerca per cognome
        const outBody = {
            'libri':[
                {
                    book_id: 831,
                    titolo: 'Libro prova 1',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Giallo',
                    Is_available : false
                },
                {
                    book_id: 832,
                    titolo: 'Libro prova 2',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Fantascienza',
                    Is_available : false
                },
                {
                    book_id: 833,
                    titolo: 'Libro prova 3',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Storia',
                    Is_available : false
                },
                {
                    book_id: 834,
                    titolo: 'Libro prova 4',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Dramma',
                    Is_available : false
                }
            ],
            message : 'Libro trovato',
            success : true
        }
        const res = await request(app)
        .get('/ricerca')
        .query({
            Author_sur: 'Prova'
        })
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro trovato')
        expect(res.body).toStrictEqual(outBody);

    });

    test('Chiamata API corretta con ricerca per nome autore', async () => {
        
        //ricerca per cognome
        const outBody = {
            'libri':[
                {
                    book_id: 831,
                    titolo: 'Libro prova 1',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Giallo',
                    Is_available : false
                },
                {
                    book_id: 832,
                    titolo: 'Libro prova 2',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Fantascienza',
                    Is_available : false
                },
                {
                    book_id: 833,
                    titolo: 'Libro prova 3',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Storia',
                    Is_available : false
                },
                {
                    book_id: 834,
                    titolo: 'Libro prova 4',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Dramma',
                    Is_available : false
                }
            ],
            message : 'Libro trovato',
            success : true
        }
        const res = await request(app)
        .get('/ricerca')
        .query({
            Author_name: 'Autore'
        })
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro trovato')
        expect(res.body).toStrictEqual(outBody);

    });

    test('Chiamata API corretta con titolo libro', async() => {
        const outBody = {
            'libri' :[{
                    book_id: 831,
                    titolo: 'Libro prova 1',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Giallo',
                    Is_available : false
                }
            ],
            message : 'Libro trovato',
            success : true
        }
        const res = await request(app)
        .get('/ricerca')
        .query({
            titolo : 'Libro prova 1'
        })
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro trovato');
        expect(res.body).toStrictEqual(outBody);
    });

    test('Chiamata API con titolo errato', async () => {
        const res = await request(app)
        .get('/ricerca')
        .query({
            titolo : 'Non esiste'
        })
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });

    test('Chiamata API con Author_sur errato', async () => {
        const res = await request(app)
        .get('/ricerca')
        .query({
            Author_sur : 'Non esiste'
        })
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });

    test('Chiamata API con Author_name errato', async () => {
        const res = await request(app)
        .get('/ricerca')
        .query({
            Author_name : 'Non esiste'
        })
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });

    test('Chiamata API con nessun input', async() => {
        const res=await request(app)
        .get('/ricerca?')
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Nessun parametro inserito');
    })
});

describe('suite testing API endpoint : "/Rented" ', ()=>{

    test('Chiamata API corretta', async () => {
        const inputBody={
            mail : 'utenteprova@gmail.com',
            titolo : 'Libro prova 5'
        }
        const res= await request(app)
        .patch('/Rented')
        .send(inputBody)
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro aggiunto');
    });

    // Aggiunta per sincronizzazione test

    test('Sincro disponibilità del test', async() => {
        const res = await request(app)
        .patch('/disponibilita')
        .query({
            titolo : 'Libro prova 5',
            mail : 'utenteprova@gmail.com'
        })
        .expect(200);
    })

    test('Chiamata API utente non esistente', async() => {
        const inputBody={
            mail : 'nonesisto@gmail.com',
            titolo : 'Libro prova 2'
        }
        const res= await request(app)
        .patch('/Rented')
        .send(inputBody)
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Utente non trovato');
    });

    test('Chiamata API libro non presente', async () => {
        const inputBody={
            mail : 'Test1@gmail.com',
            titolo : 'Non esiste'
        }
        const res= await request(app)
        .patch('/Rented')
        .send(inputBody)
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });

    test('Chiamata api con noleggi massimi',async()=>{
        const res= await request(app)
        .patch('/Rented')
        .send({
            mail : 'utenteprova2@gmail.com',
            titolo : 'Libro prova 10'
        })
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Hai raggiunto il limite di libri noleggiati');
    })

    test('Chiamata api con libro non disponibile',async()=>{
        const res= await request(app)
        .patch('/Rented')
        .send({
            mail : 'utenteprova1@gmail.com',
            titolo : 'Libro prova 1'
        })
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non disponibile');
    })
    
});

describe('suite testing api endpoint : "/createApp"',() => {

    test('Chiamata API corretta', async () => {

        const inputBody = ({
            mail : 'utenteprova@gmail.com',
            data : dataValida,
            tipo_app : 'Ritiro'
        })

        const res = await request(app)
        .post('/createApp')
        .send(inputBody)
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Appuntamento creato');
    });

    test('Chiamata API mail non esistente', async () => {

        const res = await request(app)
        .post('/createApp')
        .send({
            mail : 'nonesisto@gmail.com'
        })
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Utente non trovato');
    });

    test('Chiamata API data non scelta', async () => {

        const inputBody = ({
            mail : 'utenteprova@gmail.com',
            tipo_app : 'Ritiro'
        })

        const res = await request(app)
        .post('/createApp')
        .send(inputBody)
        .expect(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Errore del server');
    });

    test('Chiamata API data non valida', async () => {
        const inputBody = ({
            mail : 'utenteprova@gmail.com',
            data : dataNonValida,
            tipo_app : 'Ritiro'
        })

        const res = await request(app)
        .post('/createApp')
        .send(inputBody)
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Data non valida');
    })

});

describe('suite testing API endpoint: "/deleteAppuntamento', () => {
    test('Chiamata API corretta', async () => {
        const res = await request(app)
        .delete('/deleteAppuntamento')
        .query(
            {
                mail : 'utenteprova@gmail.com',
            }
        )
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Appuntamento cancellato con successo');  
    })

    test('Chiamata API con appuntamento non prenotato', async () => {
        const res = await request(app)
        .delete('/deleteAppuntamento')
        .expect(404)
        .query(
            {
                mail : 'Test3@gmail.com',
            }
        );
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Appuntamento non trovato');  
    })
})

describe('suite testing API endpoint: "/getApp', () => {
    test('Chiamata API corretta', async () => {

        const res = await request(app)
        .get('/getAppuntamento')
        .query(
            {
                mail : 'utenteprova1@gmail.com',
            }
        )
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Appuntamento trovato');  
    })

    test('Chiamata API con appuntamento non prenotato', async () => {
        jest.setTimeout(10000)
        const res = await request(app)
        .get('/getAppuntamento')
        .query(
            {
                mail : 'utenteprova@gmail.com',
            }
        )
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Appuntamento non trovato');  
    })
})