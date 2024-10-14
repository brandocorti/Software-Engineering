const express = require("express")

const multer = require("multer")
const upload = multer()

const routerApp  = express.Router();
const AppController = require("../controllers/admin");


routerApp.post('/?', upload.none(), AppController.Multa);

module.exports = routerApp;
