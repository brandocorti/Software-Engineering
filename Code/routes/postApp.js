const express = require("express")

const multer = require("multer")
const upload = multer()

const routerApp = express.Router();
const utenteController = require("../controllers/utente");

routerApp.post('/', upload.none(), utenteController.createApp);


module.exports = routerApp;