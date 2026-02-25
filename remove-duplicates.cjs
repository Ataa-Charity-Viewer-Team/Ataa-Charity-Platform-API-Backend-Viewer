const fs = require("fs");
const path = require("path");

function removeDuplicateCaps(dir) {
  const files = fs.readdirSync(dir);
  const seen = {};

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const lower = file.toLowerCase();

    if (seen[lower]) {
      console.log(`Deleting duplicate: ${fullPath}`);
      if (fs.statSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(fullPath);
      }
    } else {
      seen[lower] = true;
      if (fs.statSync(fullPath).isDirectory()) {
        removeDuplicateCaps(fullPath);
      }
    }
  });
}

removeDuplicateCaps(__dirname);
console.log("Duplicates removed based on capitalization.");