const setActiveLink = require("../middleware/setActiveLink");

const tools = [
    {
        href: "https://nodejs.org/en",
        name: "Node.js",
        description:
            "A Javascript runtime environment to write the server app in JavaScript.",
        icon: "/about_page_icons/nodejs-icon.svg",
        color: "#56a545",
    },
    {
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        name: "Javascript",
        description: "The web's programming language.",
        icon: "/about_page_icons/javascript-icon.svg",
        color: "#f0db4f",
    },
    {
        href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        name: "HTML",
        description: "To structure the webpages.",
        icon: "/about_page_icons/html-icon.svg",
        color: "#e44d26",
    },
    {
        href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
        name: "CSS",
        description: "To style the webpages.",
        icon: "/about_page_icons/css-icon.svg",
        color: "#1572b6",
    },
    {
        href: "https://expressjs.com/",
        name: "Express",
        description: "A Node.js framework to handle requests/responses.",
        icon: "/about_page_icons/express-icon.svg",
        color: "#f4f2ed",
    },
    {
        href: "https://www.npmjs.com/package/bcrypt",
        name: "Bcryptjs",
        description: "A package to hash user's passwords before storing them.",
        icon: "/about_page_icons/bcrypt-icon.png",
        color: "#fe9923",
    },
    {
        href: "https://www.npmjs.com/package/connect-pg-simple",
        name: "Connect-pg-simple",
        description: "A Postgresql session store for Express.",
        icon: "/about_page_icons/connect-pg-simple-icon.png",
        color: "#2eb8e7",
    },
    {
        href: "https://date-fns.org/",
        name: "Date-fns",
        description: "My prefered date formatting library.",
        icon: "/about_page_icons/datefns-icon.png",
        color: "#9a0f7f",
    },
    {
        href: "",
        name: "Dotenv",
        description: "To use environment variables in this project.",
        icon: "/about_page_icons/dotenv-icon.svg",
        color: "#f0db4f",
    },
    {
        href: "https://www.npmjs.com/package/dotenv",
        name: "Ejs",
        description:
            "The view engine to dynamically render content into the pages.",
        icon: "/about_page_icons/ejs-icon.png",
        color: "#f0db4f",
    },
    {
        href: "https://www.npmjs.com/package/express-session",
        name: "Express-session",
        description:
            "To create and store session data for users in the server.",
        icon: "/about_page_icons/express-session.png",
        color: "#e2996c",
    },
    {
        href: "https://express-validator.github.io/docs/",
        name: "Express-validator",
        description: "To validate and sanitize user input.",
        icon: "/about_page_icons/express-validator-icon.svg",
        color: "#663399",
    },
    {
        href: "https://www.passportjs.org/",
        name: "Passport.js",
        description:
            "Authentication middleware for Express-based web applications.",
        icon: "/about_page_icons/passportjs-icon.svg",
        color: "#00b9f1",
    },
    {
        href: "https://www.passportjs.org/packages/passport-local/",
        name: "Passport local",
        description:
            "Authentication strategy for this project (username and password stored in a DB).",
        icon: "/about_page_icons/passport-local-strategy-icon.png",
        color: "#00b9f1",
    },
    {
        href: "https://node-postgres.com/",
        name: "Pg",
        description: "A Postgresql client for Node.js",
        icon: "/about_page_icons/pg-icon.svg",
        color: "#FFFFFF",
    },
    {
        href: "https://www.postgresql.org/",
        name: "Postgresql",
        description:
            "The RDBMS used to create/manage the database and tables for this project.",
        icon: "/about_page_icons/postgresql-icon.svg",
        color: "#336791",
    },
];

const aboutController = {
    aboutGet: [
        setActiveLink,
        (req, res) => {
            res.render("pages/about", { user: req.user, tools: tools });
        },
    ],
};

module.exports = aboutController;
