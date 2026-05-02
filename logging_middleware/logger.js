const axios = require("axios");

async function log(stack, level, pkg, message) {
  try {
    await axios.post(process.env.LOG_API, {
      stack,
      level,
      package: pkg,
      message
    });
  } catch (err) {
    console.log("log failed");
  }
}

module.exports = log;