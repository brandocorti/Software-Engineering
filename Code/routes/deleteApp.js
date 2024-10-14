const express = require("express")

const multer = require("multer")
const upload = multer()

const routerApp  = express.Router();
const AppController = require("../controllers/utente");


routerApp.delete('/?', AppController.deleteApp);

module.exports = routerApp;