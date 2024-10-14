const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro1 = express.Router();
const libroController = require("../controllers/utente");

routerLibro1.get('/?', libroController.getBooks);


module.exports = routerLibro1;