const express = require("express")

const multer = require("multer")
const upload = multer()

const routerPre  = express.Router();
const PreController = require("../controllers/book");

routerPre.get('/?', PreController.getAllBooks);

module.exports = routerPre;