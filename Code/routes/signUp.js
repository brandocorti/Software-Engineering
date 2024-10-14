const express = require("express")

const multer = require("multer")
const upload = multer()

const routerSignUp = express.Router();
const utenteController = require("../controllers/utente");

routerSignUp.post('/', upload.none(), utenteController.signUp);


module.exports = routerSignUp;