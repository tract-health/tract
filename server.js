const express = require('express');
const cors = require('cors');

// set up express app
const app = express();

// set up cors options
var corsOptions = {};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({limit: '10mb', extended: true}))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({limit: '10mb', extended: true}))

// use routes
require("./backend/routes")(app);

// Create link to Angular build directory
var distDir = "./dist/";
app.use(express.static(distDir));
// send all routes to index.html
app.all("/*", function(req, res, next) {
    res.sendFile("index.html", { root: distDir });
});

// set port, listen for requests
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});