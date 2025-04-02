// index.js
const express = require('express');
const app = express();
const port = 3000;

// Route for the homepage
app.get('/', (req, res) => {
  res.send('Hello, Node.js Applicationn !');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
