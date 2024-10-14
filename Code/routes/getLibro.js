const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro1 = express.Router();
const libroController = require("../controllers/book");

routerLibro1.get('/?', libroController.Ricerca_libro);


module.exports = routerLibro1;