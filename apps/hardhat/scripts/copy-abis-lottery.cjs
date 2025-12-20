const { execSync } = require("child_process");
const path = require("path");

/**
 * Script para copiar solo los ABIs del módulo Lottery
 */
const scriptPath = path.join(__dirname, "copy-abis-module.cjs");
execSync(`node ${scriptPath} lottery`, { stdio: "inherit" });
