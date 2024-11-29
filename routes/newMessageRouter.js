const { Router } = require("express");
const newMessageRouter = Router();
const newMessageController = require("../controllers/newMessageController");
const checkAuthentication = require("../middleware/checkAuthentication");
const setActiveLink = require("../middleware/activeLink");

newMessageRouter.get(
    "/",
    checkAuthentication,
    setActiveLink,
    newMessageController.newMessageGet,
);
newMessageRouter.post("/", newMessageController.newMessagePost);

module.exports = newMessageRouter;
