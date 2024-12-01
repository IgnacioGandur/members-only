const { Router } = require("express");
const deleteUserMessageRouter = Router();
const deleteUserMessageController = require("../controllers/deleteUserMessageController");

deleteUserMessageRouter.post(
    "/",
    deleteUserMessageController.deleteUserMessagePost,
);

module.exports = deleteUserMessageRouter;
