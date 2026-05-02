const axios = require("axios");

async function log(stack, level, pkg, message) {
  try {
    await axios.post(process.env.LOG_API, {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    });
  } catch (err) {
    console.log("log failed");
  }
}

module.exports = log;