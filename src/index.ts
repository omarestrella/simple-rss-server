import express from "express";
import { getFeed } from "./parser";

let app = express();
let port = process.env.PORT || 3000;

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Controll-Allow-Methods", "GET");

  next();
});

app.get("/", async (req, res) => {
  let url: string | undefined = req.query["url"] as string;
  if (!url) {
    res.statusCode = 500;
    res.send(
      JSON.stringify({
        error: "URL is required",
      })
    );
    return;
  }
  try {
    let feed = await getFeed(url);
    res.type("json");
    res.send(JSON.stringify(feed));
  } catch (error) {
    res.statusCode = 500;
    res.send(
      JSON.stringify({
        error: error.toString(),
      })
    );
  }
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});
