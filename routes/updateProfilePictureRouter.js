const { Router } = require("express");
const updateProfilePictureRouter = Router();
const updateProfilePictureController = require("../controllers/updateProfilePictureController");

updateProfilePictureRouter.post(
    "/",
    updateProfilePictureController.updateProfilePicturePost,
);

module.exports = updateProfilePictureRouter;
