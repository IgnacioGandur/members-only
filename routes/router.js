const { Router } = require("express");
const router = Router();

// Routers
const indexRouter = require("./indexRouter");
const registerRouter = require("./registerRouter");
const usersRouter = require("./usersRouter");
const loginRouter = require("./loginRouter");
const dashboardRouter = require("./dashboardRouter");
const logoutRouter = require("./logoutRouter");
const memberRouter = require("./memberRouter");
const adminRouter = require("./adminRouter");
const deleteUserRouter = require("./deleteUserRouter");
const newMessageRouter = require("./newMessageRouter");
const deleteMessageRouter = require("./deleteMessageRouter");
const messagesRouter = require("./messagesRouter");
const updateUserProfileRouter = require("./updateUserProfileRouter");
const updatePasswordRouter = require("./updatePasswordRouter");

router.use("/", indexRouter);
router.use("/register", registerRouter);
router.use("/users", usersRouter);
router.use("/login", loginRouter);
router.use("/dashboard", dashboardRouter);
router.use("/logout", logoutRouter);
router.use("/member-pass", memberRouter);
router.use("/admin-pass", adminRouter);
router.use("/delete-user", deleteUserRouter);
router.use("/new-message", newMessageRouter);
router.use("/delete-message", deleteMessageRouter);
router.use("/messages", messagesRouter);
router.use("/update-user-profile", updateUserProfileRouter);
router.use("/update-password", updatePasswordRouter);

module.exports = router;
