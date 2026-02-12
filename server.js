const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/obfuscate", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const originalName = req.file.originalname;

  const preset = req.body.preset || "Medium";

  exec(`lua5.1 ./Prometheus/cli.lua --preset ${preset} ${inputPath}`, 
  (err, stdout, stderr) => {

    if (err) {
      return res.send("<pre>" + stderr + "</pre>");
    }

    const obfuscatedFile = inputPath + ".obfuscated.lua";

    if (!fs.existsSync(obfuscatedFile)) {
      return res.send("Arquivo obfuscado não encontrado.");
    }

    res.download(
      obfuscatedFile,
      originalName.replace(".lua", ".obfuscated.lua"),
      () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(obfuscatedFile);
      }
    );
  });
});

app.listen(PORT, () => console.log("Rodando..."));
