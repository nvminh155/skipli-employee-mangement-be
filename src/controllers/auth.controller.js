const { db, auth } = require("../firebase");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");
const { roleModel } = require("../models/role.model");
const { userModel } = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");

const createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  //generate 6 digit
  const code = Math.floor(100000 + Math.random() * 900000);

  //save to firebase
  const docRef = doc(db, "validate", phoneNumber);
  await setDoc(docRef, {
    code,
  });

  res.status(200).json({ message: "Access code created successfully" });
};

const validateAccessCode = async (req, res) => {
  try {
    const { phoneNumber, code, role } = req.body;
    const docRef = doc(db, "validate", phoneNumber);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if (docSnap.exists() && data.code === code) {
      if (role == roleModel.definedRoles.MANAGER) {
        const uuid = uuidv4();
        const userObj = {
          phoneNumber,
          fullName: "",
          email: "",
          password: "phoneNumber",
          role: roleModel.definedRoles.MANAGER,
          uuid: uuid,
        };
        console.log(userObj);
        await userModel.createUser(userObj);
      }

      return res
        .status(200)
        .json({ message: "Access code validated successfully", success: true });
    }

    res
      .status(400)
      .json({ message: "Access code validated failed", success: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, success: false });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
   // Search for a user by email and password.
   const userCredential = await signInWithEmailAndPassword(auth, email, password)
   if (!userCredential) {
       throw new Error({ error: 'Invalid login credentials' })
   }

   const user = userCredential.user;
   const userData = await userModel.getUser(user.uid);
  //  const isPasswordMatch = await bcrypt.compare(password, user.password)
  //  if (!isPasswordMatch) {
  //      throw new Error({ error: 'Invalid login credentials' })
  //  }
   return res.status(200).json({ message: "Login successful", success: true, user: userData });
}
module.exports = {
  createNewAccessCode,
  validateAccessCode,
  login
};
