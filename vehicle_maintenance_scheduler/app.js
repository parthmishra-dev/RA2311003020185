const express = require("express")
const morgan = require("morgan")
require("dotenv").config()

const Log = require("../logging_middleware/logger")

const app = express()
app.use(express.json())
app.use(morgan("dev"))

function getDepots() {
  return [
    { id: "D1", mechanicHours: 10 },
    { id: "D2", mechanicHours: 15 },
    { id: "D3", mechanicHours: 8 }
  ]
}

function getVehicles() {
  return [
    { id: "V1", time: 2, score: 10 },
    { id: "V2", time: 4, score: 40 },
    { id: "V3", time: 6, score: 30 },
    { id: "V4", time: 3, score: 50 }
  ]
}

function solve(v, cap) {
  const n = v.length
  const dp = Array(n + 1).fill(0).map(() => Array(cap + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    let t = v[i - 1].time
    let s = v[i - 1].score

    for (let w = 0; w <= cap; w++) {
      if (t <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], s + dp[i - 1][w - t])
      } else {
        dp[i][w] = dp[i - 1][w]
      }
    }
  }

  let res = []
  let w = cap

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      res.push(v[i - 1])
      w -= v[i - 1].time
    }
  }

  res.reverse()

  return {
    selected: res,
    score: dp[n][cap],
    time: res.reduce((a, b) => a + b.time, 0)
  }
}

app.get("/schedule", async (req, res) => {
  try {
    await Log("backend", "info", "route", "schedule api called")

    const depots = getDepots()
    const vehicles = getVehicles()

    const output = depots.map(d => {
      const result = solve(vehicles, d.mechanicHours)
      return {
        depot: d.id,
        ...result
      }
    })

    res.status(200).json({
      success: true,
      data: output
    })

  } catch (err) {
    await Log("backend", "error", "handler", err.message)

    res.status(500).json({
      success: false,
      message: "error occurred"
    })
  }
})

app.listen(process.env.PORT || 3000)