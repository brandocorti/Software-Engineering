const {default : mongoose} = require('mongoose');
const request = require('supertest');
require('dotenv').config();


const app = require('../server');
const jwt = require('jsonwebtoken');
const { unchangedTextChangeRange } = require('typescript');
const { error } = require('console');
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



// API di utente, usata qua per ora per scopi di syncrho del testing 
describe('suite testing API endpoint "/signUp"', () => {

    test('Chiamata API corretta', async () => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {
            const inputBody = {
                nome: "Ste",
                cognome: "Gir",
                mail: "ste.gir@gmail.com",
                password: "abcdefgh!" 
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Utente creato con successo!');
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    });

    test ('Chiamata API con mail già registrata', async() => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test1@gmail.com",
                password: "abcdefgh!"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Utente già presente con questa mail!');
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })

    test('Chiamata API con mail non valida', async() => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test1@",
                password: "abcdefgh!"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(400);
            expect(response.body).toEqual({error: 'Email non valida'});
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })

    test('Chiamata API con password non valida < 8', async() => {
        //La password deve essere lunga almeno 8 caratteri e contenere un carattere speciale
        // es : password! è valida mentre password no!
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test3@gmail.com",
                password: "passwor"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(400);
            expect(response.body).toEqual({error: 'Password non valida'});
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })

    test('Chiamata API con password non valida senza caratter speciale', async() => {
        //La password deve essere lunga almeno 8 caratteri e contenere un carattere speciale
        // es : password! è valida mentre password no!
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test3@gmail.com",
                password: "password"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(400);
            expect(response.body).toEqual({error: 'Password non valida'});
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })

    test('Chimata API con errore server', async() =>{
        const inputBody = {
            mail:'mail@mail.mail',
            password:'Prova123!'
        }

        const res = await request(app)
        .post('/signUp')
        .send(inputBody)
        .expect(500);
        expect(res.body.success).toBe(false);
    })
});

describe('suite testing API endpoint "/getAll"', () => {
    test('Chiamata corretta API', async () => {
        const response = await request(app)
        .get('/getAll');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    })
})

describe ('Suite testing API endpoint "/newLibro"', () => {
    test('Chiamata API corretta - Nuovo Libro', async () => {
        const response = await request(app)
            .post('/newLibro')
            .send({
                titolo: 'I pilastri della terra',
                Author_name: 'Ken',
                Author_sur: 'Follet',
                Genre: 'Dramma'
            });
    
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Libro aggiunto');
    });
    
    test('Chiamata API corretta - Libro già presente', async () => {
        const response = await request(app)
            .post('/newLibro')
            .send({
                titolo: 'Dune',
                Author_name: 'Frank',
                Author_sur: 'Herbert',
                Genre: 'Fantascienza'
            });
    
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Libro già presente in archivio');
    });

    test('Chiamata API errore', async () => {
        const response = await request(app)
            .post('/newLibro')
            .send();
    
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
    });
})

describe ('Suite testing API endpoint "/deleteUtente"', () => {
    test('Chiamata corretta API',async() => {
        const response = await request(app)
        .delete('/deleteUtente?mail=ste.gir@gmail.com')
        .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Utente eliminato');
    })

    test('Chiamata API con mail inesistente', async() => {
        const response = await request(app)
        .delete('/deleteUtente?mail=nonesisto@gmail.com')
        .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Utente non trovato');
    })
})

describe ('Suite testing API endpoint "/deleteLibro"', () => {
    test('Chiamata API corretta', async() => {
        const response = await request(app)
        .delete('/deleteLibro?titolo=I pilastri della terra')
        .expect(200);
    })

    test('Chiamata API libro non presente', async() => {
        const response = await request(app)
        .delete('/deleteLibro?titolo=Il libro vuoto')
        .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Libro non trovato');
    })
})

describe('Suite testing API endpoint "/disponibilita"', ()=>{
    test('Chiamata API corretta', async() => {
        //synchro test
        const res = await request(app)
        .patch('/Rented')
        .query({
            titolo : 'Libro prova 5',
            mail : 'utenteprova1@gmail.com'
        });

        const response = await request(app)
        .patch('/disponibilita')
        .query({
            titolo : 'Libro prova 5',
            mail : 'utenteprova1@gmail.com'
        })
        .expect(200);
        expect(response.body.success).toBe(true);
    });

    test('Chiamata API libro non presente', async() => {
        const response = await request(app)
        .patch('/disponibilita')
        .query({
            titolo : 'non esisto',
            mail : 'utenteprova1@gmail.com'
        })
        .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Libro non trovato');
    })

    test('Chiamata API utente non presente', async() => {
        const response = await request(app)
        .patch('/disponibilita')
        .query({
            titolo : 'Libro prova 5',
            mail : 'nonesisto@gmail.com'
        })
        .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Utente non trovato');
    })
})