const userModel = require("../model/UserModel.js");
const {
  getResourceByIdFactory,
  deleteResourceByIdFactory,
  updateResourceByIdFactory,
  createResourceFactory,
} = require("../utils/resourceFactory.js");

// const getAllUsers = getResourceFactory(userModel);
async function getAllUsers(req, res) {
  try {
    // -> if you don't pass anything -> return you the whole collection
    // -> if want to filter -> parameter -> an object
    //console.log("response from users", res);
    const listOfUser = await userModel.find();
    res.status(200).json({
      status: "successfull",
      message: `list of the user `,
      UserList: listOfUser,
    });
  } catch (err) {
    res.status(404).json({
      status: "failure",
      message: err.message,
    });
  }
}
// console.log("get all users!!", getAllUsers);

const getUserById = getResourceByIdFactory(userModel);

const createUser = createResourceFactory(userModel);
// async function createUser(req, res) {
//   try {
//     const userDetails = req.body;
//     console.log("response to create user", userDetails);
//     // adding thr product to mongodb
//     const user = await userModel.create(userDetails);
//     res.status(201).json({
//       status: "successfull",
//       message: `added  the product `,
//       product: user,
//     });
//   } catch (err) {
//     res.status(502).json({
//       status: "failure",
//       message: err.message,
//     });
//   }
// }

const deleteUser = deleteResourceByIdFactory(userModel);

const updateUserById = updateResourceByIdFactory(userModel);

module.exports = {
  updateUserById,
  deleteUser,
  createUser,
  getUserById,
  getAllUsers,
};
