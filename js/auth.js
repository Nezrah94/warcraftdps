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
    authZone.innerHTML = `<div style='display: inline-flex; align-items: center;'>
  <div style='
    display: inline-flex;
    align-items: center;
    background-color: #0078CF;
    color: white;
    font-weight: bold;
    font-size: 14px;
    border-radius: 4px 0 0 4px;
    padding: 6px 10px;
    height: 32px;
  '>
    👋 ${battletag}
  </div>
  <a href="/logout" style='
    background-color: #f44336;
    color: white;
    text-decoration: none;
    padding: 6px 10px;
    border-radius: 0 4px 4px 0;
    font-size: 14px;
    font-weight: bold;
    height: 32px;
    display: inline-flex;
    align-items: center;
    transition: background-color 0.3s ease;
  '
  onmouseover="this.style.backgroundColor='#d32f2f';"
  onmouseout="this.style.backgroundColor='#f44336';">
    ✖
  </a>
</div>`;
  } else {
    authZone.innerHTML = `<a href="/auth/battlenet" style="
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: #0078CF;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  height: 32px;
  transition: background-color 0.3s ease;
"
onmouseover="this.style.backgroundColor='#005fa3';"
onmouseout="this.style.backgroundColor='#0078CF';">
  Connexion <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Blizzard_Entertainment_Logo_2015.svg" alt="Blizzard Icon" style="height: 20px; width: 20px;">
</a>`;
  }
});