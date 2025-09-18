const { ERR_MESS } = require("../constants");

const createHttpErr = (errKey, message) => {
  let errObj = ERR_MESS[errKey];

  if(!errObj) {
    errObj = {
      key: errKey,
      message: message || "Unknown error",
      statusCode: 500,
    };
  }

  const customMessage = message ? errObj.message + ' : ' + message : errObj.message;
  return {
    ...errObj,
    message: customMessage
  };
};

module.exports = {
  createHttpErr
}