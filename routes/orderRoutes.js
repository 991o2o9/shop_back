const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const Order = require("../models/Order");

router.post("/orders", async (req, res) => {
  try {
    const { phone, orders, totalPrice } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: "Неверный формат заказов" });
    }

    if (totalPrice === undefined) {
      return res
        .status(400)
        .json({ message: "Общая сумма заказа обязательна" });
    }

    const orderTime = moment().tz("Asia/Bishkek").format("DD/MM/YYYY HH:mm");

    const newOrders = orders.map((order) => {
      if (!order.title || !order.description || !order.price || !order.img) {
        throw new Error(
          "Все элементы заказа должны содержать название, описание, цену и изображение"
        );
      }

      return {
        phone,
        title: order.title,
        description: order.description,
        img: order.img,
        price: order.price,
        quantity: order.quantity,
        totalPrice: order.price * order.quantity,
      };
    });

    const savedOrders = await Order.insertMany(newOrders);

    res.status(201).json({
      phone,
      orderTime,
      orders: savedOrders,
      totalPrice,
    });
  } catch (err) {
    res.status(500).json({ message: "Произошла ошибка при обработке заказа" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();

    const groupedOrders = orders.reduce((acc, order) => {
      if (!acc[order.phone]) {
        acc[order.phone] = {
          phone: order.phone,
          orderTime: moment().tz("Asia/Bishkek").format("DD/MM/YYYY HH:mm"),
          orders: [],
          totalPrice: 0,
        };
      }

      acc[order.phone].orders.push({
        title: order.title,
        description: order.description,
        price: order.price,
        quantity: order.quantity,
        img: order.img,
      });

      acc[order.phone].totalPrice += order.price * order.quantity;

      return acc;
    }, {});

    const result = Object.values(groupedOrders);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Произошла ошибка при получении заказов" });
  }
});

module.exports = router;
