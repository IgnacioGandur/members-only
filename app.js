require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const app = express();
const router = require("./routes/router");
const passport = require("passport");
const setActiveLink = require("./middleware/setActiveLink");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        store: new pgSession({
            pool: pool,
        }),
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30, //1 month cookie.
        },
    }),
);
app.use(passport.session());

require("./authentication/passport");

app.use(setActiveLink);
app.use(router);

app.listen(8080, () => {
    console.log("Local dev running on: http://localhost:8080/");
});
