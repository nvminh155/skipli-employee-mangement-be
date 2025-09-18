const { db } = require("../firebase");
const { doc, updateDoc } = require("firebase/firestore");
const { userModel } = require("../models/user.model");
const { createHttpErr } = require("../utils/errorHelper");
const { ERR_MESS } = require("../constants");

const setupAccount = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "User not found");
    }

    const updateData = {
      username,
      password: await userModel.hashPassword(password),
    };

    await updateDoc(doc(db, "users", user.id), updateData);

    res.status(200).json({
      message: "Account setup successfully",
      data: {
        ...user,
        ...updateData,
      },
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "User not found");
    }

    const updateData = {
      fullName,
      phoneNumber,
    }
    await updateDoc(doc(db, "users", user.id), updateData);
    
    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        ...user,
        ...updateData,
      },
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

module.exports = {
  setupAccount,
  updateProfile,
};
