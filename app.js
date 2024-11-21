const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("bla");
});

app.listen(8080, () => {
    console.log("Local dev server running on: http://localhost:8080/");
});
