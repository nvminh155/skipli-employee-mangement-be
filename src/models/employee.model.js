const { doc, setDoc } = require("firebase/firestore");
const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");

const employeeModel = {
  create: async (employee) => {
    const employeeRef = doc(db, "users", employee.id);
    await setDoc(employeeRef, {
      ...employee,
      username: "",
      password: "",
    });
  },
};

module.exports = {
  employeeModel,
};
