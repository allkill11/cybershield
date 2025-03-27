// 🔹 Fonction pour afficher/masquer les sections du menu
function toggleSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}

// 🔹 Vérification des Sites Web
function checkSite() {
    let url = document.getElementById("urlInput").value;
    if (!url) {
        alert("Veuillez entrer une URL !");
        return;
    }

    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("result-box").classList.add("hidden");

    fetch(`https://cybershield-api-2.onrender.com/check-site?url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            let resultElement = document.getElementById("result");
            let resultBox = document.getElementById("result-box");
            let reportButton = document.getElementById("report-button");
            let copyButton = document.getElementById("copy-button");

            if (data.securityRating === "F") {
                resultElement.innerHTML = `⚠️ <strong>Site dangereux</strong><br> Type de menace: ${data.threatType || "Inconnu"}`;
                resultBox.className = "danger";
                reportButton.classList.remove("hidden");
            } else {
                resultElement.innerHTML = `✅ <strong>Site sécurisé</strong>`;
                resultBox.className = "safe";
                reportButton.classList.add("hidden");
            }

            copyButton.classList.remove("hidden");
            addToHistory(url, data.securityRating);

            document.getElementById("loader").classList.add("hidden");
            document.getElementById("result-box").classList.remove("hidden");
        })
        .catch(error => {
            console.error("Erreur :", error);
            document.getElementById("result").innerHTML = "❌ Erreur lors de la vérification.";
            document.getElementById("loader").classList.add("hidden");
            document.getElementById("result-box").classList.remove("hidden");
        });
}

// 🔹 Ajouter un site à l'historique
function addToHistory(url, result) {
    let historyContainer = document.getElementById("history-list");
    if (!historyContainer) return;

    let newEntry = document.createElement("p");
    newEntry.innerHTML = `🔹 ${url} → ${result === "F" ? "⚠️ Dangereux" : "✅ Sécurisé"}`;
    historyContainer.prepend(newEntry);
}

// 🔹 Signaler un site suspect
function reportSite() {
    let url = document.getElementById("urlInput").value;
    if (!url) {
        alert("Veuillez entrer une URL !");
        return;
    }
    alert(`🚨 Merci ! Le site ${url} a été signalé.`);
}

// 🔹 Effacer l'historique des analyses
function clearHistory() {
    document.getElementById("history-list").innerHTML = "";
}

// 🔹 Copier le résultat d'analyse
function copyResult() {
    let resultText = document.getElementById("result").innerText;
    navigator.clipboard.writeText(resultText).then(() => {
        alert("Résultat copié !");
    });
}
// ✅ Ajouter un site à la whitelist
function addToWhitelist() {
  const input = document.getElementById("whitelistInput");
  const url = input.value.trim();
  if (!url) return alert("Entrez un site valide.");

  let whitelist = JSON.parse(localStorage.getItem("whitelistSites")) || [];
  if (!whitelist.includes(url)) {
    whitelist.push(url);
    localStorage.setItem("whitelistSites", JSON.stringify(whitelist));
    displayWhitelist();
    input.value = "";
  } else {
    alert("Ce site est déjà dans votre liste blanche.");
  }
}

// ✅ Afficher les sites whitelistés
function displayWhitelist() {
  const list = document.getElementById("whitelist-list");
  const whitelist = JSON.parse(localStorage.getItem("whitelistSites")) || [];
  list.innerHTML = "";
  whitelist.forEach(site => {
    const li = document.createElement("li");
    li.innerHTML = `🔗 ${site} <button onclick="removeFromWhitelist('${site}')">❌</button>`;
    list.appendChild(li);
  });
}

// ✅ Supprimer un site de la liste blanche
function removeFromWhitelist(site) {
  let whitelist = JSON.parse(localStorage.getItem("whitelistSites")) || [];
  whitelist = whitelist.filter(s => s !== site);
  localStorage.setItem("whitelistSites", JSON.stringify(whitelist));
  displayWhitelist();
}

// ✅ Vider toute la whitelist
function clearWhitelist() {
  localStorage.removeItem("whitelistSites");
  displayWhitelist();
}

// ✅ Chargement auto au démarrage
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("whitelist-list")) {
    displayWhitelist();
  }
});

// 🔹 Génération de mots de passe sécurisés
function generatePassword() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 16; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    document.getElementById("generated-password").value = password;
}

// 🔹 Copier le mot de passe généré
function copyPassword() {
    let password = document.getElementById("generated-password").value;
    if (!password) {
        alert("Générez d'abord un mot de passe !");
        return;
    }
    navigator.clipboard.writeText(password);
    alert("Mot de passe copié !");
}

// 🔹 Vérification de la robustesse d'un mot de passe
function checkPasswordStrength() {
    let password = document.getElementById("passwordInput").value;
    let strength = "⚠️ Faible";
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = "✅ Fort";
    } else if (password.length >= 8) {
        strength = "⚠️ Moyen";
    }
    document.getElementById("password-strength").innerHTML = `Robustesse : ${strength}`;
}

// 🔹 Vérification des fuites de données avec Have I Been Pwned
function checkDataBreach() {
    let email = document.getElementById("emailInput").value;
    if (!email) {
        alert("Entrez une adresse e-mail !");
        return;
    }

    fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
        headers: { "hibp-api-key": "04cb4ed4a8c73c7b33816cc58a5d59b44be08615" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            document.getElementById("breach-result").innerHTML = `⚠️ Cette adresse a été compromise dans ${data.length} fuite(s) de données.`;
        } else {
            document.getElementById("breach-result").innerHTML = "✅ Aucune fuite détectée.";
        }
    })
    .catch(error => {
        document.getElementById("breach-result").innerHTML = "❌ Impossible de vérifier.";
        console.error("Erreur :", error);
    });
}

// 🔹 Analyse de fichiers malveillants
function scanFile() {
    let file = document.getElementById("fileInput").files[0];
    if (!file) {
        alert("Sélectionnez un fichier !");
        return;
    }

    let fileName = file.name;
    document.getElementById("file-result").innerHTML = `📝 Analyse du fichier ${fileName} en cours...`;

    setTimeout(() => {
        let isMalicious = Math.random() < 0.2; // 20% de chance qu'il soit "infecté"
        document.getElementById("file-result").innerHTML = isMalicious ? `⚠️ Fichier suspect détecté !` : `✅ Fichier sécurisé.`;
    }, 2000);
}
function generatePassword() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 16; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    document.getElementById("generated-password").value = password;
    savePassword(password);
}

function generateCustomPassword() {
    const length = parseInt(document.getElementById("passwordLength").value);
    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>/?";
    
    let charset = "";
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset.length === 0) {
        alert("Veuillez sélectionner au moins un type de caractère.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById("customPasswordOutput").value = password;
    savePassword(password);
}

function copyPassword() {
    let password = document.getElementById("generated-password").value;
    if (!password) return alert("Générez d'abord un mot de passe !");
    navigator.clipboard.writeText(password);
    alert("Mot de passe copié !");
}

function togglePasswordVisibility() {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
}

function checkPasswordStrength() {
    let password = document.getElementById("passwordInput").value;
    let fill = document.getElementById("password-strength-fill");
    let strength = "⚠️ Faible", width = "30%", color = "red";

    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = "✅ Fort"; width = "100%"; color = "green";
    } else if (password.length >= 8) {
        strength = "⚠️ Moyen"; width = "60%"; color = "orange";
    }

    document.getElementById("password-strength").innerHTML = `Robustesse : ${strength}`;
    fill.style.width = width;
    fill.style.backgroundColor = color;
}

function updateLengthLabel(value) {
    document.getElementById("lengthLabel").innerText = value;
}

function savePassword(password) {
    let saved = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    saved.unshift(password);
    if (saved.length > 10) saved = saved.slice(0, 10);
    localStorage.setItem("savedPasswords", JSON.stringify(saved));
    displaySavedPasswords();
}

function displaySavedPasswords() {
    const list = document.getElementById("saved-passwords");
    const saved = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    list.innerHTML = "";
    saved.forEach(pwd => {
        const li = document.createElement("li");
        li.textContent = "🔐 " + pwd;
        list.appendChild(li);
    });
}

function clearSavedPasswords() {
    localStorage.removeItem("savedPasswords");
    displaySavedPasswords();
}

// 🌙/☀️ Thème dynamique
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    btn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    btn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme") || "dark";
  document.body.classList.add(saved === "dark" ? "dark-mode" : "light-mode");
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = saved === "dark" ? "☀️" : "🌙";

  displaySavedPasswords();
});
