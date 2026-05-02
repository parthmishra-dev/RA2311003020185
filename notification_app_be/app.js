const express = require("express")
require("dotenv").config()

const Log = require("../logging_middleware/logger")

const app = express()

app.get("/notifications", async (req, res) => {
  try {
    await Log("backend", "info", "route", "notifications api called")

    const data = [
      {
        type: "email",
        message: "Vehicle maintenance scheduled",
        timestamp: "2026-05-02 11:00"
      },
      {
        type: "sms",
        message: "Vehicle ready for pickup",
        timestamp: "2026-05-02 11:10"
      },
      {
        type: "push",
        message: "New service request assigned",
        timestamp: "2026-05-02 11:20"
      }
    ]

    res.status(200).json({
      success: true,
      notifications: data
    })

  } catch (err) {
    await Log("backend", "error", "handler", err.message)

    res.status(500).json({
      success: false,
      message: "error occurred"
    })
  }
})

app.listen(process.env.PORT || 4000)