const fs = require("fs");
const path = require("path");

/**
 * Script modular para copiar ABIs al frontend
 * Uso: node copy-abis-module.cjs <module-name>
 * Ejemplo: node copy-abis-module.cjs lottery
 */

const src = path.join(__dirname, "..", "artifacts", "contracts");
const dest = path.join(__dirname, "..", "..", "frontend", "src", "abis");

// Definir módulos de ABIs
const modules = {
  defi: [
    "DamcStakedToken.sol/DamcStakedToken.json",
    "ReyRewardToken.sol/ReyRewardToken.json",
    "MasterChefToken.sol/MasterChefToken.json",
  ],
  lottery: ["Lottery.sol/Lottery.json", "Lottery.sol/mainERC721.json"],
  all: [
    "DamcStakedToken.sol/DamcStakedToken.json",
    "ReyRewardToken.sol/ReyRewardToken.json",
    "MasterChefToken.sol/MasterChefToken.json",
    "Lottery.sol/Lottery.json",
    "Lottery.sol/mainERC721.json",
  ],
};

/**
 * Copia los ABIs de un módulo específico
 */
function copyABIs(moduleName) {
  const files = modules[moduleName];

  if (!files) {
    console.error(`❌ Error: Módulo "${moduleName}" no encontrado`);
    console.log("Módulos disponibles:", Object.keys(modules).join(", "));
    process.exit(1);
  }

  fs.mkdirSync(dest, { recursive: true });

  console.log(`\n📋 Copiando ABIs del módulo: ${moduleName}`);
  console.log("─".repeat(60));

  let copied = 0;
  let errors = 0;

  for (const rel of files) {
    try {
      const from = path.join(src, rel);
      const to = path.join(dest, path.basename(rel));

      if (!fs.existsSync(from)) {
        console.log(`⚠️  No encontrado: ${path.basename(rel)}`);
        errors++;
        continue;
      }

      fs.copyFileSync(from, to);
      console.log(`✅ ${path.basename(rel)}`);
      copied++;
    } catch (err) {
      console.log(`❌ Error copiando ${path.basename(rel)}: ${err.message}`);
      errors++;
    }
  }

  console.log("─".repeat(60));
  console.log(`📊 Resultado: ${copied} copiados, ${errors} errores`);
  console.log(`📁 Destino: ${dest}\n`);
}

// Obtener el módulo del argumento CLI
const moduleName = process.argv[2] || "all";
copyABIs(moduleName);
