const { Router } = require("express");
const updatePasswordRouter = Router();
const updatePasswordController = require("../controllers/updatePasswordController");

updatePasswordRouter.post("/", updatePasswordController.updatePasswordPost);

module.exports = updatePasswordRouter;
