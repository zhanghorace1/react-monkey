const express = require('express');
const pool = require('../database/config');
const router = express.Router();

// Fetch all surveys
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surveys ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch survey results by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Survey not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
