const { Router } = require("express");
const memberRouter = Router();
const memberController = require("../controllers/memberController");

memberRouter.post("/", memberController.memberPost);

module.exports = memberRouter;
