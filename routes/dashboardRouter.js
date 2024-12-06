const { Router } = require("express");
const dashboardRouter = Router();
const dashboardController = require("../controllers/dashboardController");
const checkAuthentication = require("../middleware/checkAuthentication");

dashboardRouter.use(dashboardController.activeSidebarLink);
dashboardRouter.use(checkAuthentication);

// Get
dashboardRouter.get("/", dashboardController.dashboardGet);
dashboardRouter.get("/profile-info", dashboardController.profileInfoGet);
dashboardRouter.get("/account-status", dashboardController.accountStatusGet);
dashboardRouter.get("/update-password", dashboardController.updatePasswordGet);
dashboardRouter.get("/delete-account", dashboardController.deleteAccountGet);
dashboardRouter.get("/user-messages", dashboardController.userMessagesGet);

// Post
dashboardRouter.post(
    "/account-status/member-pass",
    dashboardController.enableMemberStatus,
);
dashboardRouter.post(
    "/account-status/admin-pass",
    dashboardController.enableAdminStatus,
);
dashboardRouter.post(
    "/update-password",
    dashboardController.updatePasswordPost,
);
dashboardRouter.post(
    "/update-profile-picture",
    dashboardController.updateProfilePicturePost,
);
dashboardRouter.post(
    "/update-user-profile",
    dashboardController.updateuserProfilePost,
);
dashboardRouter.post("/delete-account", dashboardController.deleteAccountPost);

module.exports = dashboardRouter;
