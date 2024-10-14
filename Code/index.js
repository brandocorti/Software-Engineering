const app = require('./server.js');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 8080;

app.use(express.json());

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

const listener = app.listen(process.env.PORT || 8080, () => {
    console.log('Server in ascolto sulla porta: ' + listener.address().port)
});


module.exports = app;