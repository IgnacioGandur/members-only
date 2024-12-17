const { Router } = require("express");
const notFoundRouter = Router();
const notFoundController = require("../controllers/notFoundController");

notFoundRouter.get("/", notFoundController.notFoundPageGet);

module.exports = notFoundRouter;
