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
  const name = req.query.name;

  let usageFiltered = [];
  let nameFiltered = [];

  if (usage) {
    usageFiltered = plans.filter(plan => plan.usage === usage);
  }

  if (usageFiltered.length > 0) {
    return res.json(usageFiltered);
  }

  if (name) {
    nameFiltered = plans.filter(plan =>
      plan.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (nameFiltered.length > 0) {
    return res.json(nameFiltered);
  }
  res.json([]);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
