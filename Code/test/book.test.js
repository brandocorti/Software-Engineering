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

describe('Suite testing API endpoint : "/getAllBooks"',()=>{
    test('Chiamata API corretta', async() => {
        const response = await request(app)
        .get('/getAllBooks')
        .expect(200);
        expect(response.body.success).toBe(true);
    })
})

describe('Suite testing API endpoint: "/Filter"', () => {
    //Jest has detected the following 1 open handle potentially keeping Jest from exiting:
    // errore di timeout
    test('Chiamata API corretta filtro Genre', async() => {
        const outBody = {
            'libri':[
                {
                    book_id : 261,
                    titolo: '1984',
                    Author_name: 'George',
                    Author_sur: 'Orwell',
                    Genre: 'Fantascienza',
                    Is_available: true
                },
                {
                    book_id : 280,
                    titolo: 'Dune',
                    Author_name: 'Frank',
                    Author_sur: 'Herbert',
                    Genre: 'Fantascienza',
                    Is_available: false
                },
                {
                    book_id : 832,
                    titolo: 'Libro prova 2',
                    Author_name: 'Autore',
                    Author_sur: 'Prova',
                    Genre: 'Fantascienza',
                    Is_available: false
                }
            ],
            success: true
        }

        const response = await request(app)
        .get('/filter')
        .query({
            Genre: 'Fantascienza'
        })
        .expect(200);
        expect(response.body).toStrictEqual(outBody)
    })

    test('Chiamata API corretta filtro Author_sur', async() => {
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
            success: true
        }
        const response = await request(app)
        .get('/filter')
        .query({
            Author_sur: 'Prova'
        })
        .expect(200);
        expect(response.body).toStrictEqual(outBody);
    })


    test('Chiamta API con filtro non esistente', async() => {
        const response = await request(app)
        .get('/filter')
        .query({
            Voto: '1'
        })
        .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Filtro non selezionato o errato');
    })

    test('Chiamata API con filtro non esistente', async() => {
        const response = await request(app)
        .get('/filter')
        .query({
            Genre: 'Caso'
        })
        .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Nessun libro trovato');
    })

})