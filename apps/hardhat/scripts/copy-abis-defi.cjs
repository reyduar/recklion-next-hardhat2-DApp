const { execSync } = require("child_process");
const path = require("path");

/**
 * Script para copiar solo los ABIs del módulo DeFi
 */
const scriptPath = path.join(__dirname, "copy-abis-module.cjs");
execSync(`node ${scriptPath} defi`, { stdio: "inherit" });
