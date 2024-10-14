const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro = express.Router();
const libroController = require("../controllers/utente");

routerLibro.get('/?', libroController.getAppuntamenti);


module.exports = routerLibro;