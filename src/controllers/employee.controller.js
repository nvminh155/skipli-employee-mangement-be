const { userModel } = require("../models/user.model");
const { createHttpErr } = require("../utils/errorHelper");
const { ERR_MESS } = require("../constants");
const { transporter } = require("../lib/nodemailer");
const { config } = require("../config");
const { v4: uuidv4 } = require("uuid");
const {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  collection,
} = require("firebase/firestore");
const { db } = require("../firebase");
const { roleModel } = require("../models/role.model");
const { compareIgnoreCase } = require("../utils/stringHelper");

const getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filters = {
        keyword: "", // search by name or email
        status: "",
      },
    } = req.body;
    const skip = (page - 1) * limit;

    const docRef = collection(db, "users");
    const q = query(
      docRef,
      where("role", "!=", roleModel.definedRoles.MANAGER)
    );
    const docSnap = await getDocs(q);

    const data = docSnap.docs
      .map((doc) => doc.data())
      .slice(skip, skip + limit)
      .filter((employee) => {
        let isMatchKeyword = true,
          isMatchStatus = true;

        if (filters.keyword)
          isMatchKeyword =
            compareIgnoreCase(employee.fullName, filters.keyword) ||
            compareIgnoreCase(employee.email, filters.keyword);
        if (filters.status) isMatchStatus = employee.status === filters.status;

        return isMatchKeyword && isMatchStatus;
      });

    res.status(200).json({
      message: "Employees found",
      data: {
        employees: data,
        pagination: {
          total: docSnap.docs.length,
          page,
          limit,
          filters,
        },
      },
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, "users", id ?? "notfound");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Employee not found");
    }
    const data = docSnap.data();

    res.status(200).json({
      message: "Employee found",
      data,
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...employee } = req.body;
    const docRef = doc(db, "users", id ?? "notfound");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Employee not found");
    }

    const { phoneNumber, fullName, email, role } = employee;
    const oldData = docSnap.data();

    const updatedData = {
      phoneNumber: phoneNumber ?? oldData.phoneNumber,
      fullName: fullName ?? oldData.fullName,
      email: email ?? oldData.email,
      role: role ?? oldData.role,
    };

    await updateDoc(docRef, updatedData);

    res.status(200).json({
      message: "Employee updated successfully",
      data: {
        ...oldData,
        ...updatedData,
      },
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, "users", id ?? "notfound");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Employee not found");
    }

    await deleteDoc(docRef);
    res.status(200).json({
      message: "Employee deleted successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const createEmployee = async (req, res) => {
  try {
    let { email, ...employee } = req.body;
    if (!email) {
      throw createHttpErr(ERR_MESS.MISSING_DATA.key, "email is required");
    }

    const uuid = uuidv4();
    const checkedEmployee = await userModel.getUserByEmail(email);
    if (checkedEmployee?.id) {
      throw createHttpErr(
        ERR_MESS.ALREADY_EXISTS.key,
        "Employee's email already exists! Check again!"
      );
    }

    await userModel.createEmployee({ ...employee, email, id: uuid });

    transporter.sendMail({
      to: email,
      subject: "Confirm and setup your account",
      html:
        "Please confirm and setup your account by clicking the link below: <b>" +
        config.CLIENT_BASE_URL +
        "/employee/setup-account?code=" +
        uuid +
        "</b>",
    });

    res.status(200).json({
      message: "Employee created successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

module.exports = {
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployees,
};
