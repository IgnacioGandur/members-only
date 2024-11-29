const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/usersController");
const setActiveLink = require("../middleware/activeLink");

usersRouter.get("/", setActiveLink, usersController.usersGet);

module.exports = usersRouter;
