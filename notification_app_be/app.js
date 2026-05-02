const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const log = require("../logging_middleware/logger");

const app = express();

app.get("/notifications", async (req, res) => {
  try {
    await log("backend", "info", "route", "notifications api called");

    const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`
      }
    });

    const data = await response.json();
    let notifications = data.notifications;

    const weight = {
      Placement: 3,
      Result: 2,
      Event: 1
    };

    notifications = notifications.map(n => {
      const base = weight[n.Type] || 0;
      const timeDiff = new Date() - new Date(n.Timestamp);
      const recency = Math.max(0, 1 - timeDiff / (1000 * 60 * 60 * 24));
      return { ...n, priority: base + recency };
    });

    notifications.sort((a, b) => b.priority - a.priority);

    const top10 = notifications.slice(0, 10);

    res.json({
      success: true,
      notifications: top10
    });

  } catch (error) {
    await log("backend", "error", "handler", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
});

app.listen(process.env.PORT || 4000);