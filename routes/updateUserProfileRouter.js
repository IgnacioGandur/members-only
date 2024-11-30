const { Router } = require("express");
const updateUserProfileRouter = Router();
const updateUserProfileController = require("../controllers/updateUserProfileController");

updateUserProfileRouter.post(
    "/",
    updateUserProfileController.updateUserProfilePost,
);

module.exports = updateUserProfileRouter;
