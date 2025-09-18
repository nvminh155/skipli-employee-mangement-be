const config = {
  port: process.env.PORT || 8087,
  JWT_KEY: process.env.JWT_SECRET,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
  APP_BASE_URL: process.env.APP_BASE_URL,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
};

module.exports = {
  config
};