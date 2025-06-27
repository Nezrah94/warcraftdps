
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const axios = require('axios');
const BattlenetStrategy = require('passport-battlenet').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// DEBUG: Vérifier les variables d'environnement
console.log("[DEBUG] BNET_CLIENT_ID:", process.env.BNET_CLIENT_ID);
console.log("[DEBUG] BNET_CLIENT_SECRET:", process.env.BNET_CLIENT_SECRET);
console.log("[DEBUG] BNET_CALLBACK_URL:", process.env.BNET_CALLBACK_URL);

// 1. Middlewares nécessaires
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.cookies['connect.sid']) {
    res.clearCookie('connect.sid');
  }
  next();
});
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: true // obligatoire si sameSite='none'
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // 14 jours
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// 2. Passport Battle.net config
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

if (!process.env.BNET_CLIENT_ID || !process.env.BNET_CLIENT_SECRET || !process.env.BNET_CALLBACK_URL) {
  console.error("❌ Erreur : Variables d'environnement manquantes.");
  process.exit(1);
}

passport.use('battlenet', new BattlenetStrategy({
  clientID: process.env.BNET_CLIENT_ID,
  clientSecret: process.env.BNET_CLIENT_SECRET,
  callbackURL: process.env.BNET_CALLBACK_URL,
  region: "eu",
  scope: ["wow.profile"]
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

// 3. Routes d'authentification
app.get('/auth/battlenet', (req, res, next) => {
  console.log("[DEBUG] Lancement de l'auth Battle.net");
  passport.authenticate('battlenet', {
    scope: ['wow.profile'],
    state: 'test'
  })(req, res, next);
});

app.get('/auth/battlenet/callback',
  passport.authenticate('battlenet', { failureRedirect: '/' }),
  (req, res) => {
    res.cookie('battletag', req.user.battletag, { maxAge: 86400000 });
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('battletag');
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

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

// Sert les fichiers statiques comme script.js, CSS, images, etc.
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// 6. Route hard-logout AVANT le fallback
app.get('/hard-logout', (req, res) => {
  res.clearCookie('connect.sid');
  res.clearCookie('battletag');
  req.session.destroy(() => {
    res.send('Cookies et session supprimés. Fermez cet onglet et reconnectez-vous.');
  });
});

// 7. Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 8. Fallback final : 404 personnalisée
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
  } else {
    res.status(404).send('404 Not Found');
  }
});

// 9. Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
