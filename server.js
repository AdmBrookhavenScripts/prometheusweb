const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send(`
    <h1>Prometheus Lua Obfuscator</h1>
    <form action="/obfuscate" method="post" enctype="multipart/form-data">
      <input type="file" name="file" accept=".lua" required />
      <br><br>
      <button type="submit">Obfuscar</button>
    </form>
  `);
});

app.post("/obfuscate", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = inputPath + "_obf.lua";

  exec(`lua ./Prometheus/cli.lua --preset Medium ${inputPath} -o ${outputPath}`, 
  (err, stdout, stderr) => {
    if (err) return res.send("Erro ao obfuscar.");

    res.download(outputPath, "obfuscated.lua");
  });
});

app.listen(PORT, () => console.log("Rodando..."));
