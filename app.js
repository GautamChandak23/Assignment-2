const express = require('express');
const app = express();
app.use(express.json());

// Sample data
let users = [
  {
    username: 'user1',
    password: 'password1',
    email: 'user1@example.com',
    balance: 1000
  },
  {
    username: 'user2',
    password: 'password2',
    email: 'user2@example.com',
    balance: 500
  }
];

let transactions = [
  {
    from_username: 'user1',
    to_username: 'user2',
    transaction_id: '1',
    amount: 200
  },
  {
    from_username: 'user2',
    to_username: 'user1',
    transaction_id: '2',
    amount: 300
  }
];

// GET request to view all registered users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET request to view a registered user using a primary key
app.get('/users/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find(user => user.username === username);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST request to create/register a new user
app.post('/users', (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    balance: req.body.balance
  };
  users.push(newUser);
  res.json(newUser);
});

// DELETE request to delete all users
app.delete('/users', (req, res) => {
  users = [];
  res.json({ message: 'All users deleted' });
});

// DELETE request to delete a user using a primary key
app.delete('/users/:username', (req, res) => {
  const username = req.params.username;
  const index = users.findIndex(user => user.username === username);
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// PUT request to update user details for a given user
app.put('/users/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find(user => user.username === username);
  if (user) {
    user.password = req.body.password;
    user.email = req.body.email;
    user.balance = req.body.balance;
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// GET request to view all transactions
app.get('/transactions', (req, res) => {
  res.json(transactions);
});

// GET request to view a particular transaction using a transaction id
app.get('/transactions/:transaction_id', (req, res) => {
  const transactionId = req.params.transaction_id;
  const transaction = transactions.find(transaction => transaction.transaction_id === transactionId);
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).json({ message: 'Transaction not found' });
  }
});

// POST request to create transactions
app.post('/transactions', (req, res) => {
  const fromUsername = req.body.from_username;
  const toUsername = req.body.to_username;
  const amount = req.body.amount;

  const fromUser = users.find(user => user.username === fromUsername);
  const toUser = users.find(user => user.username === toUsername);

  if (!fromUser || !toUser) {
    return res.status(400).json({ message: 'Invalid users' });
  }

  if (fromUser.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  // Perform the transaction
  fromUser.balance -= amount;
  toUser.balance += amount;

  // Create new transaction record
  const transactionId = String(transactions.length + 1);
  const newTransaction = {
    from_username: fromUsername,
    to_username: toUsername,
    transaction_id: transactionId,
    amount: amount
  };
  transactions.push(newTransaction);

  res.json(newTransaction);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
