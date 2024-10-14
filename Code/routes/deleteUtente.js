const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro  = express.Router();
const libroController = require("../controllers/admin");

routerLibro.delete('/?', libroController.deleteUtente);


module.exports = routerLibro;