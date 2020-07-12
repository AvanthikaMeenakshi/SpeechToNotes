import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import HomePage from "./pages/home";

const app = express();
const port = process.env.PORT || 8080;

app.use(compression());
app.use("/static", serveStatic("dist/client"));

app.get("/", HomePage);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  if (port !== "0") {
    console.log(`Listening on port ${port}`);
  }
});
