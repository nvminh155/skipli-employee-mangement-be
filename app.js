const dotenv = require("dotenv");
dotenv.config();

var express = require("express");
const { config } = require("./src/config");
const { routerV1 } = require("./src/routes/v1");
const errorMiddleware = require("./src/middlewares/error.middleware");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json());

app.use("/api/v1", routerV1, errorMiddleware);

app.use("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



const sockets = require("./src/sockets");
sockets(io);



server.listen(config.port, () => {
 console.log(`Server running on port ${config.port}`);
});