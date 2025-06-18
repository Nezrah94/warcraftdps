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

const axios = require('axios');

const CLIENT_ID = process.env.BATTLENET_CLIENT_ID;
const CLIENT_SECRET = process.env.BATTLENET_CLIENT_SECRET;
const REDIRECT_URI = 'https://ton-backend.onrender.com/auth/battlenet/callback';

// Étape 1 : Rediriger l'utilisateur vers Battle.net
app.get('/auth/battlenet', (req, res) => {
  const authUrl = `https://oauth.battle.net/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid`;
  res.redirect(authUrl);
});

// Étape 2 : Récupérer le code et échanger contre un token
app.get('/auth/battlenet/callback', async (req, res) => {
  const { code } = req.query;
  try {
    // Échange code -> token
    const tokenRes = await axios.post('https://oauth.battle.net/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenRes.data.access_token;

    // Appel à l'API d'identité pour récupérer l'utilisateur
    const userRes = await axios.get('https://oauth.battle.net/oauth/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = userRes.data;

    // Pour le test, on affiche juste dans le navigateur
    res.send(`
      <h1>Bienvenue, ${user.battletag} !</h1>
      <pre>${JSON.stringify(user, null, 2)}</pre>
    `);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Erreur lors de l'authentification.");
  }
});


app.listen(PORT, () => {
  console.log(`Serveur backend et frontend démarré sur le port ${PORT}`);
});
