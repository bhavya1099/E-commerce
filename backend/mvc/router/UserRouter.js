const {
  updateUserById,
  deleteUser,
  createUser,
  getUserById,
  getAllUsers,
} = require("../controller/UserController.js");
const express = require("express");
/***User apis**/
const userRouter = express.Router();
userRouter.route("/").post(createUser).get(getAllUsers);

userRouter
  .route("/:id")
  .patch(updateUserById)
  .get(getUserById)
  .delete(deleteUser);

module.exports = userRouter;
