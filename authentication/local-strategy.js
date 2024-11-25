const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
const dbInteractions = require("../db/queries");

const strategy = new LocalStrategy(async function (username, password, done) {
    try {
        const user = await dbInteractions.getUserByUsername(username);

        if (!user) {
            return done(null, false, { message: "User not found." });
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return done(null, false, { message: "Invalid password." });
        }

        return done(null, user);
    } catch (error) {
        console.error(
            "Something went wrong creating the local strategy: ",
            error.message,
        );
        return done(error);
    }
});

module.exports = strategy;
