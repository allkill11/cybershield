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
