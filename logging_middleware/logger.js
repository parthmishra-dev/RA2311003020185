const axios = require("axios")
require("dotenv").config()

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(process.env.LOG_API, {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    })
  } catch (err) {
    console.log("log failed")
  }
}

module.exports = Log