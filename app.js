const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.post("/notification", (req, res) => {
  const notify = {
    shopId: req.body.shopId,
    message: req.body.message,
  };
  io.emit("notification", JSON.stringify(notify));
  res.status(200).send("Notification sent successfully.")
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("notification", (data) => {
    socket.emit("notification", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
