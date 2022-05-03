module.exports = app => {
    // define Express router
    var router = require("express").Router();

    // simple route to test that server works
    app.get("/test", (req, res) => {
        res.json( {message: "Test TRACT backend app"});
    });

    // use the router for the app
    app.use("/", router);
}