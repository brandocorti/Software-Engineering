const express = require("express")

const multer = require("multer")
const upload = multer()

const routerPren = express.Router();
const utenteController = require("../controllers/utente");

routerPren.post('/', upload.none(), utenteController.createPren);


module.exports = routerPren;