const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Создание заказа
router.post("/orders", async (req, res) => {
  try {
    const { phone, title, description, totalPrice, quantity } = req.body;
    const newOrder = new Order({
      phone,
      title,
      description,
      totalPrice,
      quantity,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получение всех заказов
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
