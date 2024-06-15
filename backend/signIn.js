const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const promisifiedJWTSign = promisify(jwt.sign); //converts async callback function to promisified function and returns promise
const promisifiedJWTVerify = promisify(jwt.verify);

const payload = "1234";
const secretKey = "i am a secret key";
app.get("/sign", async (req, res) => {
  try {
    //token creation
    const authToken = await promisifiedJWTSign({ data: payload }, secretKey, {
      algorithm: "HS256",
    });
    //put token into cookie
    res.cookie("jwtt", authToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    // send the response
    res.status(200).json({
      message: "signed the jwt and sending it in the cookie",
      authToken,
    });
  } catch (err) {
    console.log("error", err);
    res.status(400).json({
      message: err.message,
      status: "failure",
    });
  }
});

app.get("/verify", async (req, res) => {
  try {
    //getting token from cookies
    console.log("request!!", req);
    const jwtToken = req.cookies.jwt;
    //decryption
    const decryptedToken = await promisifiedJWTVerify(jwtToken, secretKey);
    // send the response
    res.status(200).json({
      message: "token is decoded",
      decryptedToken,
    });
  } catch (err) {
    console.log("error", err);
    res.status(400).json({
      message: err.message,
      status: "failure",
    });
  }
});

app.listen(3004, function () {
  console.log("server is listening on 3004");
});
