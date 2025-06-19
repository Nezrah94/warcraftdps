window.addEventListener('DOMContentLoaded', () => {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=').map(c => c.trim());
    acc[key] = value;
    return acc;
  }, {});

  const battletag = decodeURIComponent(cookies.battletag || '');
  const authZone = document.getElementById('auth-zone');

  if (!authZone) return;

  if (battletag) {
    authZone.innerHTML = `👋 ${battletag}`;
  } else {
    authZone.innerHTML = `
      <a href="/auth/battlenet" style="
        padding: 8px 12px;
        background-color: #0078CF;
        color: white;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
      ">Connexion Battle.net</a>
    `;
  }
});
