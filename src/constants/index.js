const ERR_MESS = {
  USER_NOT_FOUND: {
    key: "USER_NOT_FOUND",
    statusCode: 404,
    message: "User not found",
  },
  USER_ALREADY_EXISTS: {
    key: "USER_ALREADY_EXISTS",
    statusCode: 400,
    message: "User already exists",
  }
}

module.exports = {
  ERR_MESS
}