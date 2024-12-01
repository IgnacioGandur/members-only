const { Router } = require("express");
const newMessageRouter = Router();
const newMessageController = require("../controllers/newMessageController");
const checkAuthentication = require("../middleware/checkAuthentication");

newMessageRouter.get(
    "/",
    checkAuthentication,
    newMessageController.newMessageGet,
);
newMessageRouter.post("/", newMessageController.newMessagePost);

module.exports = newMessageRouter;
