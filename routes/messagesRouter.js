const { Router } = require("express");
const messagesRouter = Router();
const messagesController = require("../controllers/messagesController");
const setActiveLink = require("../middleware/activeLink");

messagesRouter.get("/", setActiveLink, messagesController.messagesGet);

module.exports = messagesRouter;
