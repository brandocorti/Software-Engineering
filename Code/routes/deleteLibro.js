const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro  = express.Router();
const libroController = require("../controllers/book");

routerLibro.delete('/?', libroController.Cancella_libro);


module.exports = routerLibro;