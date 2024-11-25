const dbInteractions = require("../db/queries");
const passport = require("passport");
const strategy = require("./local-strategy");

passport.use(strategy);
passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await dbInteractions.getUserInfoById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
