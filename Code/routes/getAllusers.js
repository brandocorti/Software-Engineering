const express = require("express")

const multer = require("multer")
const upload = multer()

const routerPre  = express.Router();
const PreController = require("../controllers/admin");

routerPre.get('/?', PreController.getAllusers);

module.exports = routerPre;