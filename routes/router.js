const { Router } = require("express");
const router = Router();

// TODO: Commented out routes must be deleted.

// Routers
const indexRouter = require("./indexRouter");
const registerRouter = require("./registerRouter");
const usersRouter = require("./usersRouter");
const loginRouter = require("./loginRouter");
const dashboardRouter = require("./dashboardRouter");
const logoutRouter = require("./logoutRouter");
const newMessageRouter = require("./newMessageRouter");
const deleteMessageRouter = require("./deleteMessageRouter");
// const updateUserProfileRouter = require("./updateUserProfileRouter");
// const updateProfilePictureRouter = require("./updateProfilePictureRouter");
const deleteUserMessageRouter = require("./deleteUserMessageRouter");

router.use("/", indexRouter);
router.use("/register", registerRouter);
router.use("/users", usersRouter);
router.use("/login", loginRouter);
router.use("/dashboard", dashboardRouter);
router.use("/logout", logoutRouter);
router.use("/new-message", newMessageRouter);
router.use("/delete-message", deleteMessageRouter);
// router.use("/update-user-profile", updateUserProfileRouter);
// router.use("/update-profile-picture", updateProfilePictureRouter);
router.use("/delete-user-message", deleteUserMessageRouter);

module.exports = router;
