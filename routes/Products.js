const express = require("express");
const router = express.Router();

const multer = require("multer");

const requireAuth = require("../middlewares/Authmiddleware");
const User = require("../models/User");
const Product = require("../models/Products");

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/upload", requireAuth, upload.single("pdfFile"), (req, res) => {
  console.log(req.file);

  const parsedData = JSON.parse(req.body.data);
  const productName = parsedData.productName;
  const quantity = parsedData.quantity;
  const dateOfShipping = parsedData.dateOfShipping;
  const selectedVendors = parsedData.selectedVendors;

  const userId = req.userId;

  const newProduct = new Product({
    productName,
    quantity,
    date: dateOfShipping,
    user: userId,
    vendor: selectedVendors,
    documentName: req.file.filename,
  });

  newProduct
    .save()
    .then((savedProduct) => {
      res
        .status(201)
        .json({ message: "Product uploaded successfully", savedProduct });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    });
});

router.get("/products", requireAuth, async (req, res) => {
  const vendorId = req.userId;

  try {
    const products = await Product.find({ vendor: vendorId });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/save-dates", async (req, res) => {
  try {
    const { productId, date1, date2, date3 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.givenDates = [{ date1, date2, date3 }];

    await product.save();

    res.status(200).json({ message: "Dates saved successfully" });
  } catch (error) {
    console.error("Error saving dates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/vendor-products", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const products = await Product.find({ user: userId });
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-scheduled-date", async (req, res) => {
  try {
    const { productId, selectedDate } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.shippingSchedule = selectedDate;

    await product.save();

    res.status(200).json({ message: "Shipping schedule updated successfully" });
  } catch (error) {
    console.error("Error updating shipping schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
