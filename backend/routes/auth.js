const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, gender, bloodGroup, city, aadharnumber, password } = req.body;
    if (!name || !email || !mobile || !gender || !bloodGroup || !city || !aadharnumber || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await Donor.findOne({ $or: [{ email }, { aadharnumber }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or Aadhar already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const donor = new Donor({ name, email, mobile, gender, bloodGroup, city, aadharnumber, password: hashedPassword });
    await donor.save();
    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: donor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, donor: { name: donor.name, email: donor.email, gender: donor.gender, bloodGroup: donor.bloodGroup, city: donor.city, aadharnumber: donor.aadharnumber, mobile: donor.mobile } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
