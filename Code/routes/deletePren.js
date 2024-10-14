const express = require("express")

const multer = require("multer")
const upload = multer()

const routerPre  = express.Router();
const PreController = require("../controllers/utente");

routerPre.delete('/?', PreController.deletePren);

module.exports = routerPre;