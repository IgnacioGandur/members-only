const indexController = require("../controllers/indexController.js");
const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);

module.exports = indexRouter;
