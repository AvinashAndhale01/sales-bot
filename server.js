const express = require('express');
const fs = require('fs');
const { Firestore } = require('@google-cloud/firestore');
const storage = require('node-persist');
const app = express();
const PORT = 8080;

app.use(express.json());

// Load plans from JSON file
const plans = JSON.parse(fs.readFileSync('plans.json', 'utf8'));
const bundledPlans = JSON.parse(fs.readFileSync('bundled.json', 'utf8'));
const locationData = JSON.parse(fs.readFileSync('location.json', 'utf8'));

const firestore = new Firestore();
const USERS_COLLECTION = 'users';

// Initialize node-persist storage
storage.init();

// Helper to generate a serial 9-digit account number using node-persist
async function generateSerialAccountNumber() {
  let current = await storage.getItem('account_number_counter');
  if (!current) current = 0;
  current += 1;
  await storage.setItem('account_number_counter', current);
  return current.toString().padStart(9, '0');
}

// Create user route
app.post('/create-user', async (req, res) => {
  try {
    const { full_name, email, phone, address } = req.body;
    if (!full_name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Generate serial 9-digit account number
    const account_number = await generateSerialAccountNumber();

    // Create user in Firestore
    await firestore.collection(USERS_COLLECTION).add({
      full_name,
      email,
      phone,
      address,
      account_number,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ account_number });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

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