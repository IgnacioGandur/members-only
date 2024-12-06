const { Router } = require("express");
const memberRouter = Router();
const memberController = require("../controllers/memberController");
const dashboardController = require("../controllers/dashboardController");

memberRouter.post(
    "/",
    dashboardController.activeSidebarLink,
    memberController.memberPost,
);

module.exports = memberRouter;
