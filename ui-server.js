const express = require("express");
const cors = require("cors");
const { initKafka, makeRequest } = require("./kafkarpc");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/place-order", (req, res) => {
  const { payload } = req.body;

  makeRequest("order", payload, (response) => {
    res.json({ message: response });
  });
});

initKafka().then(() => {
  app.listen(3001, () => console.log("UI Server running at http://localhost:3001"));
});
