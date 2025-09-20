const { taskModel } = require("../models/task.model");

const { createHttpErr } = require("../utils/errorHelper");
const { ERR_MESS } = require("../constants");
const {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  deleteDoc,
  where,
  or,
  query,
} = require("firebase/firestore");
const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");
const { userModel } = require("../models/user.model");

const createTask = async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      description,
      labels,
      estimate,
      env,
      assignedTo,
    } = req.body;

    if (!title) {
      throw createHttpErr(ERR_MESS.MISSING_DATA.key, "Title is required");
    }

    if (assignedTo) {
      const user = await userModel.getUserById(assignedTo);
      if (!user) {
        throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "User not found");
      }
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (startDateObj.getTime() > endDateObj.getTime()) {
        throw createHttpErr(
          ERR_MESS.INVALID_DATA.key,
          "Start date must be before end date"
        );
      }
    }

    const uuid = uuidv4();
    const taskRef = doc(db, "tasks", uuid);
    const newTask = {
      id: uuid,
      title,
      startDate: startDate ?? "",
      endDate: endDate ?? "",
      description: description ?? "",
      labels: labels ?? [],
      estimate: estimate ?? "",
      env: env ?? "",
      assignedTo: assignedTo ?? "",
      assignedBy: req.user.id ?? "",
      status: taskModel.definedStatus.READY,
    };
    await setDoc(taskRef, newTask);

    res.status(200).json({
      message: "Task created successfully",
      data: newTask,
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const getTasks = async (req, res) => {
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

    const docRef = collection(db, "tasks");
    const q = query(docRef);
    const docSnap = await getDocs(q);

    const data = docSnap.docs
      .map((doc) => doc.data())
      .slice(skip, skip + limit)
      .filter((task) => {
        let isMatchKeyword = true,
          isMatchStatus = true;

        if (filters.keyword)
          isMatchKeyword = task.title
            .toLowerCase()
            .includes(filters.keyword.toLowerCase());
        if (filters.status) isMatchStatus = task.status === filters.status;

        return isMatchKeyword && isMatchStatus;
      });

    const taskWithUser = data.map(async (task) => {
      return {
        ...task,
        assignedTo: task.assignedTo
          ? await userModel.getUser(task.assignedTo)
          : null,
      };
    });
    const tasks = await Promise.all(taskWithUser);
    res.status(200).json({
      message: "Tasks found",
      data: {
        tasks: tasks,
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

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getDoc(doc(db, "tasks", id));
    if (!task.exists()) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Task not found");
    }
    const data = task.data();
    const assignedTo = data.assignedTo
      ? await userModel.getUserById(data.assignedTo)
      : null;
    const assignedBy = data.assignedBy
      ? await userModel.getUserById(data.assignedBy)
      : null;

    res.status(200).json({
      message: "Task found",
      data: {
        ...data,
        assignedTo,
        assignedBy,
      },
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...task } = req.body;
    if (!task?.title) {
      throw createHttpErr(ERR_MESS.MISSING_DATA.key, "Title is required");
    }
    if (task?.assignedTo) {
      const user = await userModel.getUserById(task.assignedTo);
      if (!user) {
        throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "User not found");
      }
    }
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw createHttpErr(ERR_MESS.DATA_NOT_FOUND.key, "Task not found");
    }
    const data = docSnap.data();
    const updatedData = {
      ...data,
      ...task,
      updatedBy: req.user.id,
    };
    await updateDoc(docRef, updatedData);

    res.status(200).json({
      message: "Task updated successfully",
      data: updatedData,
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "tasks", id));

    res.status(200).json({
      message: "Task deleted successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    throw createHttpErr(ERR_MESS.INTERNAL_SERVER_ERROR.key, error.message);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
