const express = require("express");
const app = express();
const fs = require("fs");
const short = require("short-uuid");

console.log("welcome to express!");

const strContent = fs.readFileSync("./dev-data.json", "utf8");
console.log("str contetn", strContent);
const userDataStore = JSON.parse(strContent);

app.use(express.json());

app.use(function (req, res, next) {
  //will be called everytime irrespective of any endpoint acts as a middleware for requests.
  if (req.method === "POST") {
    const userDetails = req.body;

    if (Object.keys(userDetails).length === 0) {
      res.status(404).json({
        status: "failure",
        message: "The request body is empty. ",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

app.get("/", function (req, res) {
  try {
    res.status(200).json({
      result: "success",
      message: "Hello there!",
    });
  } catch (err) {
    res.status(404).json({
      result: "failure",
      message: err.message,
    });
  }
});

/** Get the user details***/
app.get("/api/user", function (req, res) {
  try {
    if (userDataStore.length == 0) {
      throw new Error("No user are present");
    }
    console.log("second second second");
    res.status(200).json({
      result: "success",
      message: userDataStore,
    });
  } catch (err) {
    res.status(404).json({
      status: "failuer",
      message: err.message,
    });
  }
});

/** Add the user details***/

app.post("/api/user", function (req, res) {
  try {
    console.log("request body", req.body);
    const userDetails = req.body;
    const id = short.generate();
    userDetails.id = id;
    userDataStore.push(userDetails);
    const strUserData = JSON.stringify(userDataStore);
    fs.writeFileSync("./dev-data.json", strUserData);
    res.status(200).json({
      status: "successful",
      message: `Update user with id ${id}`,
    });
  } catch (err) {
    res.status(502).json({
      status: "failure",
      message: err.message,
    });
  }
});

/***** delete the user *****/

app.post("/api/user", function (req, res) {
  try {
    const id = req.body.id;
    userDataStore = userDataStore.filter((d) => d.id !== id);
    const strUserData = JSON.stringify(userDataStore);
    fs.writeFileSync("./dev-data.json", strUserData);
    res.status(200).json({
      status: "successful",
      message: `Delete user with id ${id}`,
    });
  } catch (err) {
    res.status(502).json({
      status: "failure",
      message: err.message,
    });
  }
});

/****Update user with new id***/

// app.patch("/api/user", function (req, res) {
//   try {
//     const id = req.body.id;
//     const
//     res.status(200).json({
//       status: "successful",
//       message: `Delete user with id ${id}`,
//     });
//   } catch (err) {}
// });

app.get("/api/user/:id", function (req, res) {
  try {
    const id = req.params.id;
    const userDetails = getUserId(id);
    if (userDetails === "no user found") {
      throw new Error(`user with ${id}  not found`);
    } else {
      res.status(200).json({
        status: "successful",
        messag: `received the user with id ${id} `,
      });
    }
  } catch (err) {
    res.status(502).json({
      status: "failure",
      message: err.message,
    });
  }
});

app.use(function (req, res) {
  console.log("request wil be taken!!in second middleware");
  res.status(200).json({
    status: "success",
    message: "request is being considered!!",
  });
});

function getUserId(id) {
  const user = userDataStore.find((userObj) => {
    return userObj.id === id;
  });
  return user;
}

app.listen("3001", function (req, res) {
  console.log("listening at port 3001!");
});
