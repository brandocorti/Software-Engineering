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


describe('Suite testing API endpoint: "/login"',()=> {
    test('Chiamata API corretta', async() => {
        const res = await request(app)
        .post('/login')
        .send(
            {
                mail : 'giuseppeverdi@gmail.com',
                password : 'GiuseppeVerdi!'
            }
        )
        .expect(200);
        expect(res.body.success).toBe(true);
    })

    test('Chiamata API mail non presente', async() => {
        const res = await request(app)
        .post('/login')
        .send(
            {
                mail : 'nonesisto@gmail.com'
            }
        )
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Mail non corretta!');
    })

    test('Chiamata API mail non presente', async() => {
        const res = await request(app)
        .post('/login')
        .send(
            {
                mail : 'giuseppeverdi@gmail.com',
                password : '123'
            }
        )
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Password non corretta!');
    })

})



describe('Suite testing API endpoint : "/logout"', () => {

    var token = jwt.sign( {username: 'utentediprova', id : 'utentediprova'}, 'EasyLib', {expiresIn: 23200} );

    test("Chiamata all'API corretta", async() => {
        const response = await request(app)
        .get("/logout").set('x-access-token', token);
        expect(response.statusCode).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual("You logged out!");
    })

    test("Chiamata all'API senza token", async() => {
        const response = await request(app)
        .get("/logout");
        expect(response.statusCode).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("You alreayd logged out!");
    })

})