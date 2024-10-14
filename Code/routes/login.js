const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLogin = express.Router();
const loginController = require("../controllers/authentication");

routerLogin.post('/', upload.none(), loginController.login);


module.exports = routerLogin;