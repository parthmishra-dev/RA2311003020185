const express = require("express");
const log = require("../logging_middleware/logger");
require("dotenv").config();

const app = express();

function getDepots() {
  return [
    { id: 1, mechanicHours: 60 },
    { id: 2, mechanicHours: 135 },
    { id: 3, mechanicHours: 188 },
    { id: 4, mechanicHours: 97 },
    { id: 5, mechanicHours: 164 }
  ];
}

function getVehicles() {
  return [
    { id: "v1", time: 2, score: 10 },
    { id: "v2", time: 4, score: 40 },
    { id: "v3", time: 6, score: 30 },
    { id: "v4", time: 3, score: 50 }
  ];
}

function solve(v, cap) {
  const n = v.length;
  const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    let t = v[i - 1].time;
    let s = v[i - 1].score;
    for (let w = 0; w <= cap; w++) {
      if (t <= w) dp[i][w] = Math.max(dp[i - 1][w], s + dp[i - 1][w - t]);
      else dp[i][w] = dp[i - 1][w];
    }
  }

  let res = [];
  let w = cap;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      res.push(v[i - 1]);
      w -= v[i - 1].time;
    }
  }

  res.reverse();

  return {
    selected: res,
    score: dp[n][cap],
    time: res.reduce((a, b) => a + b.time, 0)
  };
}

app.get("/schedule", async (req, res) => {
  try {
    await log("backend", "info", "route", "schedule api called");

    const depots = getDepots();
    const vehicles = getVehicles();

    const output = depots.map(d => {
      const result = solve(vehicles, d.mechanicHours);
      return {
        depot: d.id,
        ...result
      };
    });

    res.json({
      success: true,
      data: output
    });

  } catch (error) {
    await log("backend", "error", "handler", error.message);
    res.status(500).json({
      success: false,
      message: "error occurred"
    });
  }
});

app.listen(process.env.PORT || 3001);