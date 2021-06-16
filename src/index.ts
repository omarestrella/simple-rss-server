import express from "express";

let app = express();
let port = process.env.PORT || 3000;

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Controll-Allow-Methods", "GET");

  next();
});

app.get("/", (req, res) => {
  console.log("query", req.query);
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});
