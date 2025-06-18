const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.BATTLENET_CLIENT_ID;
const CLIENT_SECRET = process.env.BATTLENET_CLIENT_SECRET;
const REDIRECT_URI = 'https://warcraftdps.onrender.com/auth/battlenet/callback'; // remplace par ton vrai domaine

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// === API : Articles ===
app.get('/api/articles', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'articles.json'));
  res.json(JSON.parse(data));
});

// === Auth Battle.net : redirection vers Battle.net avec paramètre `state` ===
app.get('/auth/battlenet', (req, res) => {
  const state = Math.random().toString(36).substring(2); // chaîne aléatoire
  const authUrl = `https://oauth.battle.net/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid&state=${state}`;
  res.redirect(authUrl);
});

// === Callback après connexion Battle.net ===
app.get('/auth/battlenet/callback', async (req, res) => {
  const { code } = req.query;

  try {
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

    const userRes = await axios.get('https://oauth.battle.net/oauth/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = userRes.data;

    res.send(`
      <h1>Bienvenue, ${user.battletag} !</h1>
      <pre>${JSON.stringify(user, null, 2)}</pre>
    `);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Erreur lors de l'authentification.");
  }
});

// === Fallback vers le frontend ===
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});
