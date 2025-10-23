const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ email, password: passwordHash });
  res.status(201).json({ message: "User created", user });
});



const login = asyncHandler(async (req, res) => {
    console.log(req.body);
  const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const token =  jwt.sign({
        userId : user._id,
        email : user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ user, token });
  
});

module.exports = { signup, login };
