const { Router } = require("express");
const aboutRouter = Router();
const aboutController = require("../controllers/aboutController");

aboutRouter.get("/", aboutController.aboutGet);

module.exports = aboutRouter;
