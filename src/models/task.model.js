const { doc, setDoc } = require("firebase/firestore");
const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");


const definedStatus = {
  READY: "ready",
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  REMOVED: "removed",
};

const taskModel = {
  definedStatus,
  createTask: async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await setDoc(taskRef, {
      ...task,
      status: definedStatus.READY,
    });
  },
  updateTask: async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, task);
  },
}




module.exports = {
  taskModel,
};