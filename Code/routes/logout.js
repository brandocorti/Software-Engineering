const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro1 = express.Router();
const libroController = require("../controllers/authentication");

routerLibro1.get('/?', libroController.logout);


module.exports = routerLibro1;
