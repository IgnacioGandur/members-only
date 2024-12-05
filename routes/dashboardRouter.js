const { Router } = require("express");
const dashboardRouter = Router();
const dashboardController = require("../controllers/dashboardController");
const checkAuthentication = require("../middleware/checkAuthentication");

dashboardRouter.get("/", checkAuthentication, dashboardController.dashboardGet);
dashboardRouter.use(dashboardController.activeSidebarLink);
dashboardRouter.get("/profile-info", dashboardController.profileInfoGet);
dashboardRouter.get("/profile-picture", dashboardController.profilePictureGet);
dashboardRouter.get("/account-status", dashboardController.accountStatusGet);
dashboardRouter.get("/update-password", dashboardController.updatePasswordGet);
dashboardRouter.get("/delete-account", dashboardController.deleteAccountGet);
dashboardRouter.get("/user-messages", dashboardController.userMessagesGet);

module.exports = dashboardRouter;
