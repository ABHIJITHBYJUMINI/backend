// server.js
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(cors()); // Allow all origins

// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json()); // Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded requests

// Define an endpoint (e.g., /api/greet)
app.post('/api/greet', (req, res) => {
  const { input1, input2, option } = req.body;
console.log(req.body);
  // Simple response logic
  if (!input1 || !input2 || !option) {
    return res.status(400).send({ message: 'All fields are required!' });
  }

  res.send({
    message: `Hello, ${input1}! You chose option: ${option}`,
    input1: input1,
    input2: input2,
    option: option,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
