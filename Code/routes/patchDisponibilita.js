const express = require("express")

const multer = require("multer")
const upload = multer()

const routerApp  = express.Router();
const AppController = require("../controllers/disponibilita");


routerApp.patch('/?', upload.none(), AppController.updateDisponibilita);

module.exports = routerApp;