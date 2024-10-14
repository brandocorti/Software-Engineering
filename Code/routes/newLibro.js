const express = require("express")

const multer = require("multer")
const upload = multer()

const routerNewLibro = express.Router();
const libroController = require("../controllers/admin");

routerNewLibro.post('/?', upload.none(), libroController.newLibro);


module.exports = routerNewLibro; require