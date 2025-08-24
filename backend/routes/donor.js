const express = require('express');
const Donor = require('../models/Donor');
const router = express.Router();

//filtering
router.get('/search', async (req, res) => {
  try {
    const { gender, city, bloodGroup } = req.query;
    let filter = {};
    if (gender) filter.gender = gender;
    if (city) filter.city = city;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    const donors = await Donor.find(filter).select('-password');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
