const { db, auth } = require("../firebase");
const {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} = require("firebase/firestore");
const { roleModel } = require("../models/role.model");
const { userModel } = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const { smsService } = require("../services/sms.service");
const { createHttpErr } = require("../utils/errorHelper");
const { ERR_MESS } = require("../constants");

const createNewAccessCode = async (req, res) => {
  try {
    const { email } = req.body;
    //generate 6 digit
    const code = Math.floor(100000 + Math.random() * 900000);

    //save to firebase
    const docRef = doc(db, "validate", email);
    await setDoc(docRef, {
      code,
    });

    smsService.sendPinCode(email, "Verify your account", code);

    res
      .status(200)
      .json({
        message: "Access code created successfully",
        data: null,
        success: true,
      });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const validateAccessCode = async (req, res) => {
  try {
    const { email, code, role } = req.body;
    const docRef = doc(db, "validate", email);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if (!code || !docSnap.exists() || data.code != code) {
      throw createHttpErr(
        ERR_MESS.ACCESS_CODE_VALIDATED_FAILED.key,
        "Access code validated failed"
      );
    }

    let user = await userModel.getUserByEmail(email);

    const uuid = uuidv4();
    if (!user) {
      const userObj = {
        phoneNumber: "",
        fullName: "",
        email: email,
        username: "",
        password: "",
        role:
          role === roleModel.definedRoles.MANAGER
            ? roleModel.definedRoles.MANAGER
            : roleModel.definedRoles.EMPLOYEE,
        uuid: uuid,
      };
      await userModel.createUser(userObj);
      user = await userModel.getUserByEmail(email);
    }

    //remove access code
    await updateDoc(docRef, {
      code: "",
    });

    return res.status(200).json({
      message: "Access code validated successfully",
      data: {
        ...user,
        token: userModel.generateJwtToken(user),
      },
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

module.exports = {
  createNewAccessCode,
  validateAccessCode,
};
