const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", (req, res) => {
  /** adding cookie in response ***/
  res.cookie("prevUrl", "home", {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.status(200).json({
    message: "thank you for visiting home page",
  });
});

app.get("/product", (req, res) => {
  console.log("request cookies", req.cookies);
  let msgStr = "";
  if (req.cookies.prevUrl) {
    msgStr += `you have already visited ${req.cookies.prevUrl} page`;
  }
  res.status(200).json({
    message: "thank you for visiting product page" + msgStr,
  });
});

app.get("/clearCookies", (req, res) => {
  res.clearCookie("prevUrl", { path: "/" });
  res.status(200).json({
    message: "cookie cleared successfully",
  });
});

app.listen(3002, function () {
  console.log("server is listening on port 3000");
});
