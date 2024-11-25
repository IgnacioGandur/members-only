const { Router } = require("express");
const dashboardRouter = Router();
const dashboardController = require("../controllers/dashboardController");
const checkAuthentication = require("../middleware/checkAuthentication");

dashboardRouter.get("/", checkAuthentication, dashboardController.dashboardGet);

module.exports = dashboardRouter;
