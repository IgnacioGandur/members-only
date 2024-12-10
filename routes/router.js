const { Router } = require("express");
const router = Router();

// Routers
const indexRouter = require("./indexRouter");
const registerRouter = require("./registerRouter");
const usersRouter = require("./usersRouter");
const loginRouter = require("./loginRouter");
const dashboardRouter = require("./dashboardRouter");
const logoutRouter = require("./logoutRouter");
const newMessageRouter = require("./newMessageRouter");
const deleteMessageRouter = require("./deleteMessageRouter");
const aboutRouter = require("./aboutRouter");

// Routes
router.use("/", indexRouter);
router.use("/register", registerRouter);
router.use("/users", usersRouter);
router.use("/login", loginRouter);
router.use("/dashboard", dashboardRouter);
router.use("/logout", logoutRouter);
router.use("/new-message", newMessageRouter);
router.use("/delete-message", deleteMessageRouter);
router.use("/about", aboutRouter);

module.exports = router;
