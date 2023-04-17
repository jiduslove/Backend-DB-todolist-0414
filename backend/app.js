const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

const app = express();

const port = 3010;

app.use(cors());
app.use(express.json()); // json형식을 받아들이지 못해 express가 받아들일 수 있게 하기위해 필요한 코드.
app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(port, () => {
  console.log(`Server listening on port : ${port} 🦉`);
});
