const readline = require("readline");
const defaultPin = "0200";
let userBalance = 1000000;
let mvolaEpargne = 800000;
let mvolaAvance = 0;

/* eslint-disable no-undef */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/* eslint-enable no-undef */

function promptWithTimeout(question, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeoutMs);
    rl.question(question, (answer) => {
      clearTimeout(timer);
      resolve(answer.trim());
    });
  });
}

async function validatePin() {
  for (let i = 0; i < 3; i++) {
    try {
      const pin = await promptWithTimeout("Entrer code secret: ");
      if (pin === defaultPin) return true;
      console.log("Code incorrect.");
    } catch {
      console.log("Temps écoulé.");
      return false;
    }
  }
  console.log(
    "Trop de tentatives, rendez-vous en agence Yas pour débloquer votre puce."
  );
  return false;
}

async function startUssd() {
  try {
    const code = await promptWithTimeout("Entrez le code USSD: ");
    if (code !== "#111#") {
      console.log("USSD invalide.");
      return rl.close();
    }
    await mvolaMenu();
  } catch {
    console.log("Session terminée pour inactivité.");
  } finally {
    rl.close();
  }
}

async function mvolaMenu() {
  while (true) {
    console.log("\n==== YAS et Moi ====");
    console.log("1 - Mvola");
    console.log("0 - Quitter");
    const choice = await promptWithTimeout("Choix: ");
    if (choice === "1") {
      await mvolaSubmenu();
    } else if (choice === "0") {
      console.log("Merci d’avoir utilisé notre service.");
      return;
    } else {
      console.log("Option non valide.");
    }
  }
}

async function mvolaSubmenu() {
  while (true) {
    console.log("\n==== Mvola ====");
    console.log("1 - Acheter crédit / offre Yas");
    console.log("2 - Transférer argent");
    console.log("3 - Mvola crédit / épargne");
    console.log("4 - Retrait d'argent");
    console.log("5 - Mon compte");
    console.log("6 - Recevoir de l'argent");
    console.log("0 - Retour");
    const c = await promptWithTimeout("Choix: ");
    switch (c) {
      case "1":
        await achatCreditOuOffre();
        break;
      case "2":
        await transfererArgent();
        break;
      case "3":
        await creditOuEpargneMenu();
        break;
      case "4":
        await retraitArgent();
        break;
      case "5":
        await monCompte();
        break;
      case "6":
        await recevoirArgent();
        break;
      case "0":
        return;
      default:
        console.log("Option non valide.");
    }
  }
}

async function achatCreditOuOffre() {
  console.log("\n-- Achat Crédit / Offre --");
  console.log("1 - Crédit pour mon numéro");
  console.log("2 - Crédit pour autre numéro");
  console.log("3 - Offre pour mon numéro");
  console.log("4 - Offre pour autre numéro");
  const opt = await promptWithTimeout("Choix: ");

  if (opt === "3" || opt === "4") {
    console.log("\nVotre offre actuelle: Tokana");
    console.log("A - MORA (VOIX-SMS-INTERNET)");
    console.log("   1 MORA 500");
    console.log("   2 MORA ONE 1000");
    console.log("   3 MORA+ 2000");
    console.log("   4 MORA+ 5000");
    console.log("   5 MORA INTERNATIONAL 5000");
    console.log("B - FIRST (VOIX-SMS-INTERNET)");
    console.log("   1 FIRST PREMIUM 10000");
    console.log("   2 FIRST PREMIUM+ 15000");
    console.log("   3 FIRST PRESTIGE 30000");
    console.log("   4 FIRST ROYAL 50000");
    console.log("C - YELOW (SMS-INTERNET)");
    console.log("   1 YELOW 100");
    console.log("   2 YELOW SMS 200");
    console.log("   3 YELOW 500");
    console.log("   4 YELOW 1000");
    console.log("   5 YELOW ONE 1000");
    console.log("   6 YELOW 2000");
    console.log("D - YAS Net (INTERNET)");
    console.log("   1 NET HEBDOMADAIRE");
    console.log("   2 NET MENSUEL");
    console.log("   3 ROAMING (DATA-SMS)");
    const pack = await promptWithTimeout("Pack (e.g. A1 ou B3): ");
    const mapping = {
      A1: 500,
      A2: 1000,
      A3: 2000,
      A4: 5000,
      A5: 5000,
      B1: 10000,
      B2: 15000,
      B3: 30000,
      B4: 50000,
      C1: 100,
      C2: 200,
      C3: 500,
      C4: 1000,
      C5: 1000,
      C6: 2000,
      D1: null,
      D2: null,
      D3: null,
    };
    const price = mapping[pack.toUpperCase()];
    if (price === undefined) return console.log("Pack invalide.");
    if (price === null)
      return console.log("Contactez service client pour ce pack.");
    if (price > userBalance) return console.log("Solde insuffisant.");
    let target = "votre numéro";
    if (opt === "4") target = await promptWithTimeout("Numéro destinataire: ");
    if (!(await validatePin())) return;
    userBalance -= price;
    console.log(
      `Offre activée ${pack} pour ${target}. Solde restant: ${userBalance}`
    );
  } else if (opt === "1" || opt === "2") {
    const montant = parseInt(await promptWithTimeout("Montant crédit: "), 10);
    let target = "votre numéro";
    if (opt === "2") target = await promptWithTimeout("Numéro destinataire: ");
    if (!(await validatePin())) return;
    if (montant > userBalance) return console.log("Solde insuffisant.");
    userBalance -= montant;
    console.log(
      `Achat crédit ${montant} Ariary pour ${target}. Solde: ${userBalance}`
    );
  } else {
    console.log("Option invalide.");
  }
}

async function transfererArgent() {
  console.log("\n-- Transfert Argent --");
  console.log(
    "0 - Sans numéro | 5 - Mvola Épargne | 6 - Rembourser Avance | 9 - Répertoire"
  );
  const destOpt = await promptWithTimeout("Choix destinataire: ");
  let dest = "";
  if (destOpt === "0") dest = "sans numéro";
  else if (["5", "6", "9"].includes(destOpt)) dest = destOpt;
  else dest = await promptWithTimeout("Numéro destinataire: ");

  const montant = parseInt(await promptWithTimeout("Montant: "), 10);
  console.log("Frais retrait destinataire? 1-Oui 2-Non");
  const frais = (await promptWithTimeout("> ")) === "1" ? 100 : 0;
  const description = await promptWithTimeout("Description: ");

  if (!(await validatePin())) return;
  if (montant + frais > userBalance) return console.log("Solde insuffisant.");

  userBalance -= montant + frais;
  console.log(
    `Transfert de ${montant} Ariary à ${dest} (${description}). Solde restant : ${userBalance}`
  );
}

async function creditOuEpargneMenu() {
  console.log("\n-- Crédit / Épargne --");
  console.log("1 - Épargne");
  console.log("2 - Crédit (Avance)");
  const m = await promptWithTimeout("Choix: ");
  if (m === "1") {
    console.log(
      "1-Transfert vers Épargne | 2-Transfert vers compte | 3-Consultation | 4-Simulateur"
    );
    const e = await promptWithTimeout("Option: ");
    if (e === "1") {
      if (!(await validatePin())) return;
      const a = parseInt(await promptWithTimeout("Montant: "), 10);
      if (a > userBalance) return console.log("Solde insuffisant.");
      userBalance -= a;
      mvolaEpargne += a;
      console.log(
        `Épargné ${a}. Solde: ${userBalance}, Épargne: ${mvolaEpargne}`
      );
    } else if (e === "2") {
      if (!(await validatePin())) return;
      const a = parseInt(await promptWithTimeout("Montant: "), 10);
      if (a > mvolaEpargne) return console.log("Montant > épargne.");
      mvolaEpargne -= a;
      userBalance += a;
      console.log(
        `Retrait épargne ${a}. Solde: ${userBalance}, Épargne: ${mvolaEpargne}`
      );
    } else if (e === "3") {
      if (!(await validatePin())) return;
      console.log(`Solde Épargne: ${mvolaEpargne}`);
    } else if (e === "4") {
      const a = parseInt(await promptWithTimeout("Montant : "), 10);
      const i = Math.floor(a * 0.05);
      console.log(`Après 1 an: ${a + i} Ariary`);
    } else {
      console.log("Option invalide.");
    }
  } else if (m === "2") {
    console.log("1-Demander Avance | 2-Rembourser Avance");
    const a = await promptWithTimeout("Choix: ");
    if (a === "1") {
      const amt = parseInt(
        await promptWithTimeout("Montant (max 150000): "),
        10
      );
      if (amt > 150000) return console.log("Montant > 150000.");
      if (!(await validatePin())) return;
      mvolaAvance = amt;
      console.log(`Avance de ${amt} accordée.`);
    } else if (a === "2") {
      if (!(await validatePin())) return;
      if (mvolaAvance === 0) return console.log("Aucune avance à rembourser.");
      mvolaAvance = 0;
      console.log("Avance remboursée.");
    } else {
      console.log("Option invalide.");
    }
  } else {
    console.log("Option invalide.");
  }
}

async function retraitArgent() {
  console.log("\n-- Retrait d'argent --");
  console.log("1 - Agent Mvola | 2 - DAB SGM");
  const typeRetrait = await promptWithTimeout("Choix: ");
  const montant = parseInt(await promptWithTimeout("Montant: "), 10);

  if (!(await validatePin())) return;
  if (montant > userBalance) return console.log("Solde insuffisant.");

  userBalance -= montant;
  const moyen = typeRetrait === "1" ? "Agent Mvola" : "DAB SGM";
  console.log(`Retiré ${montant} via ${moyen}. Solde: ${userBalance}`);
}

async function monCompte() {
  console.log("\n-- Mon compte --");
  if (!(await validatePin())) return;
  console.log(`Solde disponible: ${userBalance}`);
}

async function recevoirArgent() {
  console.log("\n-- Recevoir de l'argent --");
  console.log(`Épargne disponible: ${mvolaEpargne}`);
  console.log(`Avance disponible: ${mvolaAvance}`);
}

startUssd();
