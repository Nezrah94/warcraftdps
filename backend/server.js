const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 📁 Sert les fichiers frontend (HTML/CSS/JS) à partir du dossier parent
app.use(express.static(path.join(__dirname, '../')));

// 📰 API : Articles
app.get('/api/articles', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'articles.json'));
  res.json(JSON.parse(data));
});

// 🔁 Pour toute autre route, renvoyer index.html (permet le routage frontend si besoin)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur backend et frontend démarré sur le port ${PORT}`);
});
