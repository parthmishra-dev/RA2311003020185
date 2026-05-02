const express = require("express");
require("dotenv").config();

const app = express();

app.get("/notifications", async (req, res) => {
  try {
    const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`
      }
    });

    const data = await response.json();

    let notifications = data.notifications;

    notifications = notifications.map(n => {
      let priority = 0;

      if (n.Type === "Placement") priority = 3;
      else if (n.Type === "Result") priority = 2;
      else priority = 1;

      const timeDiff = new Date() - new Date(n.Timestamp);
      const recency = Math.max(0, 1000000000 - timeDiff) / 1000000000;

      return { ...n, priority: priority + recency };
    });

    notifications.sort((a, b) => b.priority - a.priority);

    const top10 = notifications.slice(0, 10);

    res.json({
      success: true,
      notifications: top10
    });

  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching notifications"
    });
  }
});

app.listen(process.env.PORT || 4000);