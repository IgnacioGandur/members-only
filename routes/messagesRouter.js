const { Router } = require("express");
const messagesRouter = Router();
const messagesController = require("../controllers/messagesController");

messagesRouter.get("/", messagesController.messagesGet);

module.exports = messagesRouter;
