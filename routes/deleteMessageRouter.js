const { Router } = require("express");
const deleteMessageRouter = Router();
const deleteMessageController = require("../controllers/deleteMessageController");

deleteMessageRouter.post("/", deleteMessageController.deleteMessagePost);

module.exports = deleteMessageRouter;
