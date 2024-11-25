const { Router } = require("express");
const adminRouter = Router();
const adminController = require("../controllers/adminController");

adminRouter.post("/", adminController.adminPost);

module.exports = adminRouter;
