const indexController = require("../controllers/indexController.js");
const { Router } = require("express");
const indexRouter = Router();
const setActiveLink = require("../middleware/activeLink");

indexRouter.get("/", setActiveLink, indexController.indexGet);

module.exports = indexRouter;
