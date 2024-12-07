const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Counter = require("../models/Counter");

// Создание товара
router.post("/products", async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "productId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const { img, title, desc, price } = req.body;

    // Создание нового продукта с увеличенным ID
    const newProduct = new Product({
      id: counter.value,
      img,
      title,
      desc,
      price,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при создании товара: " + err.message });
  }
});

// Получение всех товаров
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении товаров: " + err.message });
  }
});

// Обновление товара
router.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении товара: " + err.message });
  }
});

// Удаление товара
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.status(200).json({ message: "Товар удалён", product: deletedProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении товара: " + err.message });
  }
});

module.exports = router;
