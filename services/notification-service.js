const { Kafka } = require("kafkajs");
const connectDB = require("../db");
const Notification = require("../models/notificationModel");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const kafka = new Kafka({ clientId: "notification", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "notification-group" });

async function start() {
  await connectDB();
  await consumer.connect();

  await consumer.subscribe({ topic: "order-confirmed", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const msg = JSON.parse(message.value.toString());
      console.log(" Notification service received:", msg);

      const messageText = `Order confirmed: ${msg.itemName} (ID: ${msg.itemId}) x${msg.quantity}`;

      const newNotification = await Notification.create({
        itemId: msg.itemId,
        itemName: msg.itemName,
        quantity: msg.quantity,
        message: messageText,
      });

      console.log("Notification logged:", newNotification.message);
    },
  });
}

start();

// // Endpoint to fetch latest notification
// app.get("/latest-notification", async (req, res) => {
//   const latest = await Notification.findOne().sort({ createdAt: -1 });
//   if (!latest) return res.status(404).json({ message: "No notifications found" });

//   res.json({ message: latest.message });
// });

// app.listen(3003, () => console.log("Notification service listening on port 3003"));
