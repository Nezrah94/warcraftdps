const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API - Articles
app.get('/api/articles', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'articles.json'));
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré : http://localhost:${PORT}`);
});
