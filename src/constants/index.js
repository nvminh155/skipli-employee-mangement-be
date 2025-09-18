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
  },
  ALREADY_EXISTS: {
    key: "ALREADY_EXISTS",
    statusCode: 400,
    message: "Already exists",
  },
  DATA_NOT_FOUND: {
    key: "DATA_NOT_FOUND",
    statusCode: 404,
    message: "Data not found",
  },
  ACCESS_CODE_VALIDATED_FAILED: {
    key: "ACCESS_CODE_VALIDATED_FAILED",
    statusCode: 400,
    message: "Access code validated failed",
  },
  MISSING_DATA: {
    key: "MISSING_DATA",
    statusCode: 400,
    message: "Missing data",
  },
  INTERNAL_SERVER_ERROR: {
    key: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
    message: "Internal server error",
  },
}

module.exports = {
  ERR_MESS
}