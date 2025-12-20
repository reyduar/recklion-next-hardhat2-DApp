const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "artifacts", "contracts");
const dest = path.join(__dirname, "..", "..", "frontend", "src", "abis");

fs.mkdirSync(dest, { recursive: true });

const wanted = [
  "DamcStakedToken.sol/DamcStakedToken.json",
  "ReyRewardToken.sol/ReyRewardToken.json",
  "MasterChefToken.sol/MasterChefToken.json",
  "Lottery.sol/Lottery.json",
  "Lottery.sol/mainERC721.json",
];

for (const rel of wanted) {
  const from = path.join(src, rel);
  const to = path.join(dest, path.basename(rel));
  fs.copyFileSync(from, to);
  console.log("ABI copied:", path.basename(rel));
}
