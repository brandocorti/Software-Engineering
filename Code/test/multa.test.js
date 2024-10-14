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


describe('Suite testing API endpoint "/newMulta"' ,() => {
    test('Chiamata API corretta',async() => {
        const res = await request(app)
       .post('/postMulta')
       .send({
            mail : 'utenteprova@gmail.com',
            importo : 10,
        })
        .expect(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Multa creata');
    })

    test('Chiamata API con utente non esistente', async () => {
        const res = await request(app)
       .post('/postMulta')
       .send({
            mail : 'nonesisto@gmail.com',
            importo : 10,
        })
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Utente non trovato');
    })
})

describe('Suite testing API endpoint "/getMulta"' ,() => {
    test('Chiamata api corretta', async() =>{
        const res = await request(app)
       .get('/getMulta')
       .query({
            mail : 'utenteprova@gmail.com'
       })
       .expect(200);
       expect(res.body.success).toBe(true);
       expect(res.body.message).toBe('Multa trovata');
    })

    test('Chiamata API con multa non esistente', async () => {
        const res = await request(app)
       .get('/getMulta')
       .query({
            mail : 'nonesisto@gmail.com'
        })
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Utente non ha una multa');
    })
})