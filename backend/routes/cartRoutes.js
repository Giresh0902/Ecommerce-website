const express = require('express');
const router = express.Router();

// Cart is managed client-side in localStorage.
// This route exists for future server-side cart persistence.
router.get('/', (req, res) => res.json({ message: 'Cart managed client-side' }));

module.exports = router;
