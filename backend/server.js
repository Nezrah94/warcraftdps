const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
const BattlenetStrategy = require('passport-battlenet').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares nécessaires
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// 2. Passport Battle.net config
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new BattlenetStrategy({
  clientID: process.env.BNET_CLIENT_ID,
  clientSecret: process.env.BNET_CLIENT_SECRET,
  callbackURL: process.env.BNET_CALLBACK_URL,
  region: "eu"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// 3. Routes d'authentification
app.get('/auth/battlenet', passport.authenticate('battlenet'));
app.get('/auth/battlenet/callback',
  passport.authenticate('battlenet', { failureRedirect: '/' }),
  (req, res) => {
    res.cookie('battletag', req.user.battletag, { maxAge: 86400000 });
    res.redirect('/');
  }
);

// 4. API d'articles
app.get('/api/articles', (req, res) => {
  const articles = [
    {
      id: 1,
      title: "Aborder un nouveau progress",
      summary: "Cet article aborde les étapes à suivre...",
      image: "/asset_article-placeholder.png"
    },
    {
      id: 2,
      title: "Se déplacer correctement",
      summary: "Un focus sur l'art du déplacement...",
      image: "/asset_article-placeholder.png"
    },
    {
      id: 3,
      title: "Le bon raideur",
      summary: "Être un bon raideur ne se limite pas à faire du DPS...",
      image: "/asset_article-placeholder.png"
    }
  ];
  res.json(articles);
});

// 5. Servir les fichiers frontend statiques
app.use(express.static(path.join(__dirname, '../')));

// 6. Fallback pour les routes HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 7. Démarrage serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});