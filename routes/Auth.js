const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const KEY = process.env.SECRET_KEY;

// Registration route

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

   
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

  
    const newUser = new User({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
      type: userType,
    });


    await newUser.save();

    res.status(201).json({ message: "Registration successful", newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const user = await User.findOne({ email: email });
    const type = user.type;

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

   
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

   
    const token = jwt.sign(
      {
        userId: user._id,
      },
      `${KEY}`,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Authentication successful",
      token: token,
      type: type,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Authentication failed" });
  }
});

router.get("/vendor", async (req, res) => {
  try {
    const data = await User.find({ type: "vendor" });

    if (data) {
      return res.status(200).json({ message: "found vendors", data });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
