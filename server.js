const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Load plans from JSON file
const plans = JSON.parse(fs.readFileSync('plans.json', 'utf8'));
const bundledPlans = JSON.parse(fs.readFileSync('bundled.json', 'utf8'));
const locationData = JSON.parse(fs.readFileSync('location.json', 'utf8'));

app.get('/', (req, res) => {
  res.send('Internet Plans API is running!');
});

app.get('/plans', (req, res) => {
  res.json(plans);
});

app.get('/bundled', (req, res) => {
  res.json(bundledPlans);
});

app.get('/location', (req, res) => {
  res.json(locationData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
