const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/usersController");

usersRouter.get("/", usersController.usersGet);
usersRouter.get("/:userId", usersController.userProfileGet);

module.exports = usersRouter;
