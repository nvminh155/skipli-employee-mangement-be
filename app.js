const dotenv = require("dotenv");
dotenv.config();

var express = require("express");
const { default: config } = require("./src/config");
const { routerV1 } = require("./src/routes/v1");
const errorMiddleware = require("./src/middlewares/error.middleware");
const app = express();


app.use(express.json());

app.use("/api/v1", routerV1, errorMiddleware);


app.listen(config.port, () => {
 console.log(`Server running on port ${config.port}`);
});