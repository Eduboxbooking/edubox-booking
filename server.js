const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'bookings.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function loadBookings() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    return [];
  }
}

function saveBookings(bookings) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

app.get('/api/bookings', (req, res) => {
  const bookings = loadBookings();
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  if (!booking || !booking.date || !booking.time || !booking.name || !booking.phone || !booking.faculty || !booking.device || !booking.reason) {
    return res.status(400).json({ error: 'Missing booking fields' });
  }

  const bookings = loadBookings();
  bookings.push({ ...booking, savedAt: new Date().toISOString() });
  saveBookings(bookings);
  res.status(201).json({ success: true, booking });
});

app.delete('/api/bookings', (req, res) => {
  saveBookings([]);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Edu Box booking server running on http://localhost:${PORT}`);
});
