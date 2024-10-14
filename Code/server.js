const express = require('express');
const app = express();
const path = require('path');

// Frontend configuration
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'homepage.html')); 
});

app.use(express.json())


// Documentazione
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//API utente
app.use('/signUp', require('./routes/signUp')) 
app.use('/deleteAppuntamento', require('./routes/deleteApp')); 
app.use('/arrayLibri', require('./routes/getBooks')) 
app.use('/Rented', require('./routes/patchRent')) 
app.use('/getMulta', require('./routes/getMulta'))
app.use('/logout', require('./routes/logout')) 
app.use('/createApp', require('./routes/postApp'))
app.use('/getAppuntamento', require('./routes/getApp')) 

// API libro
app.use('/getAllBooks', require('./routes/getAllBooks')); 
app.use('/ricerca', require('./routes/getLibro')); 
app.use('/CancellaLibro', require('./routes/deleteLibro')); 
app.use('/filter', require('./routes/Filter')); 
app.use('/disponibilita', require('./routes/patchDisponibilita')) 

//API authentication
app.use('/login', require('./routes/login')); 


//API admin
app.use('/getAll', require('./routes/getAllusers')); 
app.use('/newLibro', require('./routes/newLibro')); 
app.use('/deleteUtente', require('./routes/deleteUtente')); 
app.use('/deleteLibro', require('./routes/deleteLibro')); 
app.use('/postMulta', require('./routes/postMulta')) 

module.exports = app;




