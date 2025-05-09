const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");

fs.readdir(uploadDir, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(uploadDir, file), (err) => {
      if (err) throw err;
      console.log(`Deleted: ${file}`);
    });
  }
});
