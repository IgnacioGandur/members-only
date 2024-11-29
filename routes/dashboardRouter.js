const { Router } = require("express");
const dashboardRouter = Router();
const dashboardController = require("../controllers/dashboardController");
const checkAuthentication = require("../middleware/checkAuthentication");
const setActiveLink = require("../middleware/activeLink");

dashboardRouter.get(
    "/",
    checkAuthentication,
    setActiveLink,
    dashboardController.dashboardGet,
);

module.exports = dashboardRouter;
