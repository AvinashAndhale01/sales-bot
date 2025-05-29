const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Load plans from JSON file
const plans = JSON.parse(fs.readFileSync('plans.json', 'utf8'));
console.log(plans);

app.get('/', (req, res) => {
  res.send('Internet Plans API is running!');
});

app.get('/plans', (req, res) => {
  const usage = req.query.usage_type;
  if (usage) {
    const filtered = plans.filter(plan => plan.usage === usage);
    res.json(filtered);
  } else {
    res.json(plans);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
