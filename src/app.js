const compression = require("compression");
const express = require("express");
const app = express();
const { helmet } = require("helmet");
const morgan = require("morgan");

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.get("/", (req, res, next) => {
  const strCompress = "hello";
  return res.status(200).json({
    message: "Welcome Fan tip js!!",
    metadata: strCompress.repeat(10000),
  });
});

module.exports = app;
