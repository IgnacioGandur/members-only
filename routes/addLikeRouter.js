const { Router } = require("express");
const addLikeRouter = Router();
const addLikeController = require("../controllers/addLikeController");

addLikeRouter.post("/", addLikeController.addLikePost);

module.exports = addLikeRouter;
