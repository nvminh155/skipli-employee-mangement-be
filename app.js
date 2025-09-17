const dotenv = require("dotenv");
dotenv.config();

var express = require("express");
const { default: config } = require("./src/config");
var app = express();


app.listen(config.port, () => {
 console.log(`Server running on port ${config.port}`);
});