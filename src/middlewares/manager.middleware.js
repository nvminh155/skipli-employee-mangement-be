const { roleModel } = require("../models/role.model");
const { createHttpErr } = require("../utils/errorHelper");
const { ERR_MESS } = require("../constants");

module.exports = async (req, res, next) => {
  if (req.user.role !== roleModel.definedRoles.MANAGER) {
    throw createHttpErr(ERR_MESS.LIMIT_PERMISSION.key, "This action is only for managers");
  }
  next();
};
