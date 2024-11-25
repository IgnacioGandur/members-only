const { Router } = require("express");
const deleteUserRouter = Router();
const deleteUserController = require("../controllers/deleteUserController");

deleteUserRouter.post("/", deleteUserController.deleteUserPost);

module.exports = deleteUserRouter;
