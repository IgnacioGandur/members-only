const indexController = require("../controllers/indexController.js");
const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);
indexRouter.get("/sort", indexController.sortMessages);

module.exports = indexRouter;
