const { Router } = require("express");
const registerController = require("../controllers/registerController");
const registerRouter = Router();
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");
const setActiveLink = require("../middleware/activeLink");

registerRouter.get(
    "/",
    checkIfLoggedIn,
    setActiveLink,
    registerController.registerGet,
);
registerRouter.post("/", registerController.registerPost);

module.exports = registerRouter;
