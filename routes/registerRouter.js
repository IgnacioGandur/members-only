const { Router } = require("express");
const registerController = require("../controllers/registerController");
const registerRouter = Router();
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");

registerRouter.get("/", checkIfLoggedIn, registerController.registerGet);
registerRouter.post("/", registerController.registerPost);

module.exports = registerRouter;
