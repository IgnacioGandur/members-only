const { Router } = require("express");
const newMessageRouter = Router();
const newMessageController = require("../controllers/newMessageController");

newMessageRouter.get("/", newMessageController.newMessageGet);
newMessageRouter.post("/", newMessageController.newMessagePost);

module.exports = newMessageRouter;
